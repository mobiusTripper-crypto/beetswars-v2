import { getRoundlistNum } from "./roundlist.helper";

export async function roundlist() {
  const result = await getRoundlistNum(true);
  return result;
}

export async function dashData(round = 0) {
  const latest = 29;
  if (!round) round = latest;

  const result = {
    beetsEmissionsPerDay: 125000,
    fantomBlocksPerDay: 75000,
    totalFbeetsSupply: 84000000,
    roundBeetsEmissions: 1000222,
    roundEmissionsUsd: 75432,
    voteIncentivesRoi: 287,
    poolsOverThreshold: 6,
    totalRelics: 0,
    payoutStatus: "pending",
  };
  return result;
}

export async function bribesRoi(round = 0) {
  if (!round) return {};
  const result = {
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
