import { Chart } from "types/chart.trpc";
import { readAllChartdata } from "utils/database/chartdata.db";

export default async function getChartdata(): Promise<Chart[] | null> {
  const data = await readAllChartdata();
  if (!data) return null;
  const result = data.map((item) => {
    return {
      round: item.round,
      bribedVotes: item.bribedVotes,
      bribedVotesRatio: (item.bribedVotes / item.totalVotes) * 100,
      totalVotes: item.totalVotes,
      totalVoter: item.totalVoter,
      totalBribes: item.totalBribes ?? NaN,
      totalOffers: item.totalBriber,
      avgPer1000: Number(
        ((item.totalBribes / item.bribedVotes) * 1000).toFixed(2)
      ),
      priceBeets: Number(item.priceBeets.toFixed(4)),
      priceFbeets: Number(item.priceFbeets.toFixed(4)),
      endTime: new Date(item.voteEnd * 1000).toLocaleDateString("en-US"),
      votingApr:
        (item.totalBribes / item.priceFbeets / item.bribedVotes) * 2600,
    };
  });
  return result;
}
