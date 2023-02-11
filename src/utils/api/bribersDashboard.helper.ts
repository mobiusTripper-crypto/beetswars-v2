import type { BribesRoi, DashboardData } from "types/bribersDashboard.trpc";
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
  const votesPercent = 100 * (votes / totalvotes); // done
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
