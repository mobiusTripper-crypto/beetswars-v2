import type { OverallStats } from "types/overallstats.trpc";
import { readAllChartdata } from "utils/database/chartdata.db";

export default async function getOverallStats(): Promise<OverallStats | null> {
  const data = await readAllChartdata();
  if (!data) return null;
  const rounds = data.length;
  const bribedVotes = data.reduce((sum, a) => sum + a.bribedVotes, 0);
  const totalVotes = data.reduce((sum, a) => sum + a.totalVotes, 0);
  const bribedVotesRatio = Number(((bribedVotes / totalVotes) * 100).toFixed(2));
  const totalVoter = data.reduce((sum, a) => sum + a.totalVoter, 0);
  const totalBribes = data.reduce((sum, a) => sum + a.totalBribes, 0);
  const totalOffers = data.reduce((sum, a) => sum + a.totalBriber, 0);
  const avgPer1000 = Number(((totalBribes / bribedVotes) * 1000).toFixed(2));
  const sumPriceBeets = data.reduce((sum, a) => sum + a.priceBeets, 0);
  const avgPriceBeets = Number((sumPriceBeets / rounds).toFixed(4));
  const votingApr = data.map(round => {
    const x = (round.totalBribes / round.priceFbeets / round.bribedVotes) * 2600;
    return !x ? 0 : x;
  });
  const avgVotingApr =
    (votingApr.reduce((sum, a) => sum + a ?? 0) / rounds).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + " %";
  const result: OverallStats = {
    rounds,
    bribedVotes,
    bribedVotesRatio,
    totalVotes,
    totalVoter,
    totalBribes,
    totalOffers,
    avgPer1000,
    avgPriceBeets,
    avgVotingApr,
  };
  return result;
}
