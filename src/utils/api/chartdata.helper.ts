import { Chart } from "types/chart.trpc";
import { Echarts } from "types/echarts.trpc";
import { readAllChartdata } from "utils/database/chartdata.db";

export async function getChartdata(): Promise<Chart[] | null> {
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

export default async function getEchartData(): Promise<Echarts | null> {
  const data = await readAllChartdata();
  if (!data) return null;
  const rounds = data.map((round) => `Round  ${round.round}`);
  const bribedVotes = data.map((round) => round.bribedVotes);
  const bribedVotesRatio = data.map((round) => {
    return Number(((round.bribedVotes / round.totalVotes) * 100).toFixed(2));
  });
  const totalVotes = data.map((round) => round.totalVotes);
  const totalVoter = data.map((round) => round.totalVoter);
  const totalBribes = data.map((round) => {
    return round.totalBribes === 0 ? "NaN" : round.totalBribes;
  });
  const totalOffers = data.map((round) => round.totalBriber);
  const avgPer1000 = data.map((round) => {
    return Number(((round.totalBribes / round.bribedVotes) * 1000).toFixed(2));
  });
  const priceBeets = data.map((round) => {
    return Number(round.priceBeets.toFixed(4));
  });
  const endTime = data.map((round) => {
    return new Date(round.voteEnd * 1000).toLocaleDateString("en-US");
  });
  const votingApr = data.map((round) => {
    return (round.totalBribes / round.priceFbeets / round.bribedVotes) * 2600;
  });
  const result: Echarts = {
    rounds,
    bribedVotes,
    bribedVotesRatio,
    totalVotes,
    totalVoter,
    totalBribes,
    totalOffers,
    avgPer1000,
    priceBeets,
    endTime,
    votingApr,
  };
  return result;
}
