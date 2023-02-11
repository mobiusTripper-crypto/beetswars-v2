import type { BribesRoi, DashboardData } from "types/bribersDashboard.trpc";
import type { CardData } from "types/card.component";
import type { VotablePool } from "types/votablePools.raw";
import { readOneBribefile } from "utils/database/bribefile.db";
import { findConfigEntry } from "utils/database/config.db";
import { readRoundPoolentries } from "utils/database/votablePools.db";
import { getBlockByTs } from "utils/externalData/ftmScan";
import { getTotalFbeets } from "utils/externalData/liveRpcQueries";
import { getSnapshotVotesPerPool } from "utils/externalData/snapshot";
import { getEmissionForRound } from "./bribeApr.helper";
import getBribeData from "./bribedata.helper";
import { getEmissionForBlockspan } from "./emission.helper";
import { getRoundlistNum } from "./roundlist.helper";
import { initialInsertFromSnapshot } from "./votablePools.helper";

export async function roundlist() {
  const result = await getRoundlistNum(true);
  return result;
}

export async function commonDashData(round = 0): Promise<CardData[]> {
  const data = await dashData(round);
  const roundtext = `for Round ${round} ${data.payoutStatus !== "settled" ? "estimated" : ""}`;
  if (!data) return [];
  return [
    {
      heading: "Beets Emissions",
      text: "last 24 hours",
      footer: data.beetsEmissionsPerDay.toLocaleString(),
    },
    {
      heading: "Fantom Blocks",
      text: "last 24 hours",
      footer: data.fantomBlocksPerDay.toLocaleString(),
    },
    {
      heading: "Total fBEETS Supply",
      text: "totally minted fBEETS",
      footer: data.totalFbeetsSupply.toLocaleString(),
    },
    {
      heading: "Beets Emissions for Votes",
      text: roundtext,
      footer: data.roundBeetsEmissions.toLocaleString(),
    },
    {
      heading: "Round Emissions USD",
      text: roundtext,
      footer: "$ " + data.roundEmissionsUsd.toLocaleString(),
    },
    { heading: "Vote Incentives ROI", text: roundtext, footer: `${data.voteIncentivesRoi} %` },
    {
      heading: "Pools over Threshold",
      text: roundtext,
      footer: data.poolsOverThreshold.toString(),
    },
    { heading: "Total Relics", text: "up to now", footer: data.totalRelics.toString() },
    { heading: "Payout Status", text: "", footer: data.payoutStatus },
  ];
}

export async function poolDashData(round: number, voteindex: number): Promise<CardData[]> {
  const data = await bribesRoi(round, voteindex);
  if (!data) return [];
  const roundtext = `for Round ${round} ${data.payoutStatus !== "settled" ? "estimated" : ""}`;
  return [
    { heading: "Pool Name", text: "", footer: data.poolname },
    { heading: "Pool Votes", text: roundtext, footer: data.votes.toLocaleString() },
    { heading: "Pool Votes %", text: roundtext, footer: data.votesPercent.toFixed(2) + " %" },
    {
      heading: "Total Incentives",
      text: roundtext,
      footer: "$ " + data.poolIncentivesUsd.toLocaleString(),
    },
    {
      heading: "Pool Incentives",
      text: roundtext,
      footer: "$ " + data.poolIncentivesUsd.toLocaleString(),
    },
    { heading: "Pool Incentives ROI", text: roundtext, footer: data.roiPercent.toFixed() + " %" },
    {
      heading: "Total Emissions value",
      text: roundtext,
      footer: "$ " + data.totalEmissionUsd.toLocaleString(),
    },
    {
      heading: "Emissions to Pool",
      text: roundtext,
      footer: "$ " + data.poolEmissionUsd.toLocaleString(),
    },
    { heading: "Payout Status", text: "", footer: data.payoutStatus },
  ];
}

export async function dashData(round = 0): Promise<DashboardData> {
  const latest = await findConfigEntry("latest");
  if (!round) round = Number(latest || 0);
  const ONEDAY = 24 * 60 * 60;
  const tsnow = Math.floor(Date.now() / 1000) - 60;
  // get blocks
  const startBlock = await getBlockByTs(tsnow - ONEDAY);
  const endBlock = await getBlockByTs(tsnow);

  // get emissions for round
  const roundEmissions = await getEmissionForRound(round);
  const roundEmissionsUsd = !roundEmissions
    ? 0
    : Math.round(roundEmissions.voteEmission * roundEmissions.beetsPrice);
  const payoutStatus = !roundEmissions ? "estimated" : roundEmissions.payoutStatus;

  // get number of eligible pools
  const votablePools = (await readRoundPoolentries(round)) || ([] as VotablePool[]);
  const poolsOverThreshold = votablePools.reduce((sum, x) => (x.isUncapped ? sum + 1 : sum), 0);
  const beetsEmissionsPerDay = Math.floor(await getEmissionForBlockspan(startBlock, endBlock));
  const fantomBlocksPerDay = endBlock - startBlock;
  const totalFbeetsSupply = await getTotalFbeets();
  const roundBeetsEmissions = Math.round(roundEmissions?.voteEmission || 0);
  const voteIncentivesRoi = Math.round(roundEmissions?.avgBribeRoiInPercent || 0);

  const result: DashboardData = {
    beetsEmissionsPerDay,
    fantomBlocksPerDay,
    totalFbeetsSupply,
    roundBeetsEmissions,
    roundEmissionsUsd,
    voteIncentivesRoi,
    poolsOverThreshold,
    totalRelics: 0,
    payoutStatus,
  };
  return result;
}

export async function bribesRoi(round: number, voteindex: number): Promise<BribesRoi | null> {
  if (!round) return null;
  let isBribed = true;

  const bribefile = await readOneBribefile(round); // raw data from database
  if (!bribefile) return null;
  const voteDashboard = await getBribeData(round); // data from dashboard
  if (!voteDashboard) return null;
  const snapshot = bribefile.snapshot;

  let poolList = await readRoundPoolentries(round);
  if (!poolList) poolList = await initialInsertFromSnapshot(round, snapshot);
  if (!poolList) return null;
  const uncapped = poolList.find(x => x.voteindex === voteindex)?.isUncapped || false;

  const roundEmissions = await getEmissionForRound(round);
  const totalEmissionUsd = !roundEmissions
    ? 0
    : Math.round(roundEmissions.voteEmission * roundEmissions.beetsPrice);

  const bribe = bribefile.bribedata.find(x => x.voteindex === voteindex);
  if (!bribe) isBribed = false;
  const votesAllPools = await getSnapshotVotesPerPool(snapshot);
  const votesThisPool = votesAllPools.find(x => x.poolId === (voteindex + 1).toString());
  const votes = votesThisPool?.votes || 0;
  const poolname = poolList.find(x => x.voteindex === voteindex)?.poolName || "no Name";
  const totalvotes = votesAllPools.reduce((sum, x) => sum + x.votes, 0);
  const rawPercent = 100 * (votes / totalvotes);
  const votesPercent = uncapped ? rawPercent : Math.min(rawPercent, 1);
  const totalIncentivesUsd = voteDashboard.header.totalBribes;
  const poolData = voteDashboard.bribelist.find(x => x.voteindex === voteindex);
  const poolIncentivesUsd = isBribed && poolData ? poolData.rewardAmount : 0;
  const poolEmissionUsd = totalEmissionUsd * (votesPercent / 100);
  const roiPercent = (100 * poolIncentivesUsd) / poolEmissionUsd;
  const payoutStatus = !roundEmissions ? "estimated" : roundEmissions.payoutStatus;

  const result: BribesRoi = {
    poolname,
    votes,
    votesPercent,
    totalIncentivesUsd,
    poolIncentivesUsd,
    totalEmissionUsd,
    poolEmissionUsd,
    roiPercent,
    payoutStatus,
  };

  return result;
}
