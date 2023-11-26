import type { EmissionData } from "types/emission.raw";
import { readOneChartdata } from "utils/database/chartdata.db";
import { getPrice } from "utils/externalData/pricefeed";
import { getBlockByTsGraph } from "utils/externalData/theGraph";
import { getEmissionForBlockspan } from "./emission.helper";

export async function getEmissionForRound(round: number): Promise<EmissionData | null> {
  // start at Wed Jan 12, 2022 - the start of round 1 payout (I guess)
  const ROUND1 = 1641988800; // timestamp of 12-01-2022 12:00 pm UTC as reference point
  const TWOWEEKS = 14 * 24 * 60 * 60; // seconds
  const ts1 = ROUND1 + (round - 1) * TWOWEEKS; // from end of previous round
  const ts2 = ts1 + TWOWEEKS; // to end of given round
  const now = Math.round(Date.now() / 1000) - 60; // one minute back to give a buffer to data providers
  let start = 0;
  let end = 0;
  let factor = 1; // to expand shorter timespan to full 14 days
  let payoutStatus;

  // switch cases
  // A) emission is finished (ts2 <= now)
  if (ts2 <= now) {
    start = ts1;
    end = ts2;
    payoutStatus = "settled";
  }
  // B) emission has started but not finished (ts1 < date.now, ts2 > date.now) take emissions from start to now and expand to 14 days
  else if (ts1 < now) {
    // start = ts1;
    start = now - 14 * 24 * 60 * 60;
    end = now;
    //factor = TWOWEEKS / (end - start); // expand to full 14 days
    factor = 1;
    payoutStatus = "payout active";
  }
  // C) emission has not yet started (ts1 > date.now) take emissions of last 1 day * 14
  else {
    //  start = now - 24 * 60 * 60; //one day back
    start = now - 14 * 24 * 60 * 60; //14 days back
    end = now;
    // factor = 14;
    factor = 1;
    payoutStatus = "estimated";
  }
  const block1 = await getBlockByTsGraph(start);
  const block2 = await getBlockByTsGraph(end);

  const emission = factor * (await getEmissionForBlockspan(block1, block2));

  const chartdata = await readOneChartdata(round);

  const beetsPrice = !chartdata
    ? // ? await getCoingeckoCurrentPrice("beethoven-x")
      await getPrice(false, { token: "BEETS", tokenId: 0, coingeckoid: "beethoven-x" })
    : chartdata.priceBeets;
  const usdValue = emission * beetsPrice;
  const voteEmissionPercent = round < 29 ? 0.3 : 0.5;
  const voteEmission = Math.round(emission * 0.872 * voteEmissionPercent); // 30% or 50% of 87.2% of emissions
  const percentUsdValue = (voteEmission * beetsPrice) / 100;

  const externallyBribedVotes = chartdata?.externallyBribedVotes || 0;

  const bribedEmissions = !chartdata
    ? 0
    : (chartdata.bribedVotes / chartdata.totalVotes) * voteEmission * beetsPrice;
  const externalBribedEmissions = !chartdata
    ? 0
    : (externallyBribedVotes / chartdata.totalVotes) * voteEmission * beetsPrice;

  const totalBribes = chartdata?.totalBribes || 0;
  const totalExternalBribes = chartdata?.totalExternalBribes || 0;

  const avgBribeRoiInPercent = !chartdata ? 0 : (bribedEmissions / chartdata.totalBribes) * 100;
  const avgExternalBribeRoiInPercent = !chartdata
    ? 0
    : (externalBribedEmissions / totalExternalBribes) * 100;
  return {
    round,
    emission,
    beetsPrice,
    usdValue,
    voteEmission,
    percentUsdValue,
    totalBribes,
    avgBribeRoiInPercent,
    avgExternalBribeRoiInPercent,
    payoutStatus,
    totalExternalBribes,
  } as EmissionData;
}
