import { Echarts } from "types/echarts.trpc";
import { readAllChartdata } from "utils/database/chartdata.db";

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
    return round.totalBribes === 0 ? NaN : round.totalBribes;
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
    return parseFloat(((round.totalBribes / round.priceFbeets / round.bribedVotes) * 2600).toFixed(2));
  });
  const bribersRoi = data.map((round) => {
    return !round.bribersRoi ? NaN : Number(round.bribersRoi.toFixed(2));
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
    bribersRoi,
  };
  return result;
}
