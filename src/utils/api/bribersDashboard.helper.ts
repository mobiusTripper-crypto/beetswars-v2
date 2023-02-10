import type { BribesRoi, DashboardData } from "types/bribersDashboard.trpc";
import type { VotablePool } from "types/votablePools.raw";
import { readOneBribefile } from "utils/database/bribefile.db";
import { findConfigEntry } from "utils/database/config.db";
import { readRoundPoolentries } from "utils/database/votablePools.db";
import { getBlockByTs } from "utils/externalData/ftmScan";
import { getTotalFbeets } from "utils/externalData/liveRpcQueries";
import { getEmissionForRound } from "./bribeApr.helper";
import { getEmissionForBlockspan } from "./emission.helper";
import { getRoundlistNum } from "./roundlist.helper";

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

export async function bribesRoi(round = 0): Promise<BribesRoi | null> {
  if (!round) return null;

  const bribefile = await readOneBribefile(round);
  if (!bribefile) return null;

  const result: BribesRoi = {
    poolname: "",
    votes: 123,
    votesPercent: 2.48,
    totalIncentivesUsd: 3987.65,
    poolIncentivesUsd: 99,
    totalEmissionUsd: 8765.43,
    poolEmissionUsd: 297,
    roiPercent: 300,
    payoutStatus: "estimated",
  };

  return result;
}
