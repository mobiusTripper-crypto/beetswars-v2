import { readOneChartdata } from "utils/database/chartdata.db";
import { getCoingeckoCurrentPrice } from "utils/externalData/coingecko";
import { getBlockByTs } from "utils/externalData/ftmScan";
import { getBeetsPerBlock } from "utils/externalData/theGraph";

export interface EmissionData {
  round: string;
  emission: number;
  beetsPrice: number;
  usdValue: number;
  voteEmission: number;
  percentUsdValue: number;
  avgBribeRoiInPercent: number;
}

export async function getEmissionForRound(round: string): Promise<EmissionData | null> {
  console.log("getEmissionForRound");
  // start at Wed Jan 12, 2022 - the start of round 1 payout (I guess)
  const ROUND1 = 1641988800; // timestamp of 12-01-2022 12:00 pm UTC as reference point
  const TWOWEEKS = 14 * 24 * 60 * 60; // seconds
  const ts1 = ROUND1 + (+round - 1) * TWOWEEKS; // from end of previous round
  const ts2 = ts1 + TWOWEEKS; // to end of given round
  const now = Math.round(Date.now() / 1000) - 60; // one minute back to give a buffer to data providers
  let start = 0;
  let end = 0;
  let factor = 1; // to expand shorter timespan to full 14 days

  // switch cases
  // A) emission is finished (ts2 <= now)
  if (ts2 <= now) {
    console.log("finished");
    start = ts1;
    end = ts2;
  }
  // B) emission has started but not finished (ts1 < date.now, ts2 > date.now) take emissions from start to now and expand to 14 days
  else if (ts1 < now) {
    console.log("active");
    start = ts1;
    end = now;
    factor = TWOWEEKS / (end - start); // expand to full 14 days
  }
  // C) emission has not yet started (ts1 > date.now) take emissions of last 1 day * 14
  else {
    console.log("future");
    start = now - 24 * 60 * 60; //one day back
    end = now;
    factor = 14;
  }
  const block1 = await getBlockByTs(start);
  const block2 = await getBlockByTs(end);
  const beets1 = await getBeetsPerBlock(block1);
  const beets2 = await getBeetsPerBlock(block2);
  const blockCount = block2 - block1;
  console.log(`Block ${block1} @ ${start} - ${block2} @ ${end} with ${beets1} - ${beets2} BEETS`);
  // early return on error
  if (!beets1 || !beets2 || !blockCount) return null;
  let emission = blockCount * beets1 * factor;
  // if emission changed during epoch
  if (beets1 !== beets2) {
    const changeBlock = await findEmissionChangeBlock(block1, block2);
    // console.log("changeBlock: ", changeBlock);
    const part1 = (changeBlock - block1) * beets1;
    const part2 = (block2 - changeBlock) * beets2;
    emission = (part1 + part2) * factor;
  }
  const beetsPrice = await findBeetsPrice(round);
  const usdValue = emission * beetsPrice;
  const voteEmission = Math.round(emission * 0.872 * 0.3); // 30% of 87.2% of emissions
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
  };
}

// find block by continuous halving
async function findEmissionChangeBlock(lowBlock: number, highBlock: number): Promise<number> {
  // console.log("try to find change block");
  const beets1 = await getBeetsPerBlock(lowBlock);
  const beets2 = await getBeetsPerBlock(highBlock);
  let beets3 = 0;
  if (beets1 === beets2) return highBlock + 1; // return early if no change
  let mid = Math.round((lowBlock + highBlock) / 2);
  do {
    beets3 = await getBeetsPerBlock(mid);
    if (beets3 === beets1) {
      lowBlock = mid;
    } else {
      highBlock = mid;
    }
    mid = Math.round((lowBlock + highBlock) / 2);
    // console.log(
    //   `Low: ${lowBlock} - ${beets1}, High: ${highBlock} - ${beets2}, Next: ${mid} - ${beets3} BEETS`
    // );
  } while (lowBlock + 1 !== highBlock);
  return highBlock;
}

// find BEETS price from database or from live source
async function findBeetsPrice(round: string): Promise<number> {
  const chartdata = await readOneChartdata(round);
  if (!!chartdata) return chartdata.priceBeets;
  const cg = await getCoingeckoCurrentPrice("beethoven-x");
  return cg;
}

// find ROI from chartdata
async function findRoi(round: string, voteEmissionUsd: number) {
  const chartdata = await readOneChartdata(round);
  if (!chartdata) return 0;
  const bribedEmissions = (chartdata.bribedVotes / chartdata.totalVotes) * voteEmissionUsd;
  const bribeRoiPercent = (bribedEmissions / chartdata.totalBribes) * 100;
  return bribeRoiPercent;
}
