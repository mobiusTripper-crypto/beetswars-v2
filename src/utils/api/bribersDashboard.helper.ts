import type { BribesRoi, DashboardData } from "types/bribersDashboard.trpc";
import type { CardData } from "types/card.component";
import type { VotablePool } from "types/votablePools.raw";
import { readOneBribefile } from "utils/database/bribefile.db";
import { findConfigEntry } from "utils/database/config.db";
import { readRoundPoolentries } from "utils/database/votablePools.db";
import { getTotalFbeets } from "utils/externalData/liveRpcQueries";
import { getSnapshotProposal, getSnapshotVotesPerPool } from "utils/externalData/snapshot";
import { getBlockByTsGraph, getRelicLevelInfo } from "utils/externalData/theGraph";
import { getEmissionForRound } from "./bribeApr.helper";
import getBribeData, { getBribeDataCalculated } from "./bribedata.helper";
import { getEmissionForBlockspan } from "./emission.helper";
import { getRoundlistNum } from "./roundlist.helper";
import { initialInsertFromSnapshot } from "./votablePools.helper";

const FIRST_ROUND_FOR_RECLICS = 32;

export async function roundlist() {
  const result = await getRoundlistNum(true);
  return result;
}

export async function commonDashData(round = 0): Promise<CardData[]> {
  if (!round) return [];
  const data = await dashData(round);
  const roundtext = `for Round ${round} ${data.payoutStatus !== "settled" ? "(estimated)" : ""}`;
  const totalFbeets = Math.round(data.totalFbeetsSupply);
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
      heading: "Pools over Threshold",
      text: `for Round ${round}`,
      footer: data.poolsOverThreshold.toString(),
    },
    {
      heading: "Beets Emissions for Votes",
      text: roundtext,
      footer: data.roundBeetsEmissions.toLocaleString(),
    },
    {
      heading: "Round Emissions USD",
      text: roundtext,
      footer: data.roundEmissionsUsd.toLocaleString(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }),
    },
    { heading: "Vote Incentives ROI", text: roundtext, footer: `${data.voteIncentivesRoi} %` },
    {
      heading: "External Vote Incentives ROI",
      text: roundtext,
      footer: `${data.externalVoteIncentivesRoi} %`,
    },
    {
      heading: "Total Incentives USD",
      text: `for Round ${round}`,
      footer: data.totalVoteIncentives.toLocaleString(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }),
    },
    round >= FIRST_ROUND_FOR_RECLICS
      ? {
          heading: "maBEETS voting power",
          text: `out of ${totalFbeets.toLocaleString()} fBEETS deposited`,
          footer: data.totalVotingPower.toLocaleString(undefined, { maximumFractionDigits: 0 }),
        }
      : {
          heading: "Total voting Power",
          text: "totally minted fBEETS",
          footer: totalFbeets.toLocaleString(),
        },
    round >= FIRST_ROUND_FOR_RECLICS
      ? {
          heading: "Total Relics",
          text: "at vote snapshot time",
          footer: data.totalRelics.toLocaleString(undefined, { maximumFractionDigits: 0 }),
        }
      : { heading: "Payout Status", text: "", footer: data.payoutStatus },
  ];
}

export async function poolDashData(round: number, voteindex: number): Promise<CardData[]> {
  if (!round) return [];
  const data = await bribesRoi(round, voteindex);
  if (!data) return [];
  const roundtext = `for Round ${round} ${data.payoutStatus !== "settled" ? "(estimated)" : ""}`;
  return [
    { heading: "Pool Name", text: "", footer: data.poolname },
    {
      heading: "Pool Votes",
      text: `for Round ${round}`,
      footer: data.votes.toLocaleString(undefined, { maximumFractionDigits: 0 }),
    },
    {
      heading: "Pool Votes %",
      text: `(uncapped: ${(data.rawPercent || 0).toLocaleString(undefined, {
        maximumFractionDigits: 2,
      })} %)`,
      footer: data.votesPercent.toLocaleString(undefined, { maximumFractionDigits: 2 }) + " %",
    },
    {
      heading: "Total Incentives",
      text: roundtext,
      footer: "$ " + data.totalIncentivesUsd.toLocaleString(),
    },
    {
      heading: "Pool Incentives",
      text: roundtext,
      footer: "$ " + data.poolIncentivesUsd.toLocaleString(),
    },
    {
      heading: "Pool Incentives ROI",
      text: roundtext,
      footer: data.roiPercent.toLocaleString(undefined, { maximumFractionDigits: 1 }) + " %",
    },
    {
      heading: "Total Emissions value",
      text: roundtext,
      footer: "$ " + data.totalEmissionUsd.toLocaleString(undefined, { maximumFractionDigits: 0 }),
    },
    {
      heading: "Emissions to Pool",
      text: roundtext,
      footer: "$ " + data.poolEmissionUsd.toLocaleString(undefined, { maximumFractionDigits: 0 }),
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
  const startBlock = await getBlockByTsGraph(tsnow - ONEDAY);
  const endBlock = await getBlockByTsGraph(tsnow);
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
  let totalFbeetsSupply = await getTotalFbeets();
  const roundBeetsEmissions = Math.round(roundEmissions?.voteEmission || 0);
  // divert to live data, if round eq latest
  let totalVoteIncentives = roundEmissions?.totalBribes || 0;
  let totalExternalVoteIncentives = roundEmissions?.totalExternalBribes || 0;
  let voteIncentivesRoi = Math.round(roundEmissions?.avgBribeRoiInPercent || 0);
  let externalVoteIncentivesRoi = Math.round(roundEmissions?.avgExternalBribeRoiInPercent || 0);
  if (round === latest) {
    const calcBribe = await getBribeDataCalculated(round);
    if (!!calcBribe) {
      totalVoteIncentives = calcBribe.header.totalBribes;

      const bribedEmissions =
        (calcBribe.header.bribedVotes / calcBribe.header.totalVotes) * roundEmissionsUsd;
      voteIncentivesRoi = !totalVoteIncentives
        ? 0
        : Math.round((bribedEmissions / totalVoteIncentives) * 100);

      const externallyBribedEmissions =
        (calcBribe.externallyBribedVotes / calcBribe.header.totalVotes) * roundEmissionsUsd;
      externalVoteIncentivesRoi = !totalVoteIncentives
        ? 0
        : Math.round((externallyBribedEmissions / totalExternalVoteIncentives) * 100);
    }
  }
  //get relics and maxVP
  let totalRelics = 0;
  let totalVotingPower = totalFbeetsSupply;
  if (round >= FIRST_ROUND_FOR_RECLICS) {
    totalFbeetsSupply = 0;
    const bribefile = await readOneBribefile(round); // raw data from database
    if (!!bribefile) {
      const proposal = bribefile.snapshot;
      const prop = await getSnapshotProposal(proposal);
      if (!!prop) {
        const block = parseInt(prop.snapshot);
        const levelInfo = await getRelicLevelInfo(block);
        totalFbeetsSupply = levelInfo?.totalFbeets || 0;
        totalRelics = levelInfo?.relicCount || 0;
        totalVotingPower = levelInfo?.totalVotingPower || 0;
      }
    }
  }
  const result: DashboardData = {
    beetsEmissionsPerDay,
    fantomBlocksPerDay,
    totalFbeetsSupply,
    roundBeetsEmissions,
    roundEmissionsUsd,
    totalVoteIncentives,
    voteIncentivesRoi,
    externalVoteIncentivesRoi,
    poolsOverThreshold,
    totalRelics,
    totalVotingPower,
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
  let uncapped = poolList.find(x => x.voteindex === voteindex)?.isUncapped || false;
  if (round < 29) uncapped = true;

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
  const roiPercent = !poolIncentivesUsd ? 0 : (100 * poolEmissionUsd) / poolIncentivesUsd;
  const payoutStatus = !roundEmissions ? "estimated" : roundEmissions.payoutStatus;

  const result: BribesRoi = {
    poolname,
    votes,
    votesPercent,
    rawPercent,
    totalIncentivesUsd,
    poolIncentivesUsd,
    totalEmissionUsd,
    poolEmissionUsd,
    roiPercent,
    payoutStatus,
  };

  return result;
}
