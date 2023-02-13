import type { EmissionData } from "types/emission.raw";
import { readOneChartdata } from "utils/database/chartdata.db";
import { getCoingeckoCurrentPrice } from "utils/externalData/coingecko";
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
    start = ts1;
    end = now;
    factor = TWOWEEKS / (end - start); // expand to full 14 days
    payoutStatus = "payout active";
  }
  // C) emission has not yet started (ts1 > date.now) take emissions of last 1 day * 14
  else {
    start = now - 24 * 60 * 60; //one day back
    end = now;
    factor = 14;
    payoutStatus = "estimated";
  }
  const block1 = await getBlockByTsGraph(start);
  const block2 = await getBlockByTsGraph(end);

  const emission = factor * (await getEmissionForBlockspan(block1, block2));

  const beetsPrice = await findBeetsPrice(round);
  const usdValue = emission * beetsPrice;
  const voteEmissionPercent = round < 29 ? 0.3 : 0.5;
  const voteEmission = Math.round(emission * 0.872 * voteEmissionPercent); // 30% or 50% of 87.2% of emissions
  const percentUsdValue = (voteEmission * beetsPrice) / 100;
  const avgBribeRoiInPercent = await findRoi(round, voteEmission * beetsPrice);
  return {
    round,
    emission,
    beetsPrice,
    usdValue,
    voteEmission,
    percentUsdValue,
    avgBribeRoiInPercent,
    payoutStatus,
  } as EmissionData;
}

// find BEETS price from database or from live source
async function findBeetsPrice(round: number): Promise<number> {
  const chartdata = await readOneChartdata(round);
  if (!!chartdata) {
    // console.log(chartdata);
    return chartdata.priceBeets;
  }
  const cg = await getCoingeckoCurrentPrice("beethoven-x");
  return cg;
}

// find ROI from chartdata
async function findRoi(round: number, voteEmissionUsd: number) {
  const chartdata = await readOneChartdata(round);
  if (!chartdata) return 0;
  const bribedEmissions = (chartdata.bribedVotes / chartdata.totalVotes) * voteEmissionUsd;
  const bribeRoiPercent = (bribedEmissions / chartdata.totalBribes) * 100;
  return bribeRoiPercent;
}
