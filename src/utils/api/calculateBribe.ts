import type { Bribedata, Tokendata } from "types/bribedata.raw";
import type { SingleOffer } from "types/bribelist.trpc";
import { getCoinGeckoHistoryOldMethod } from "utils/externalData/coingecko";
import { getRpcPrice } from "utils/externalData/liveRpcPrice";
import { getSnapshotVotesPerPool } from "utils/externalData/snapshot";

export async function calculateSingleOffer(
  bribe: Bribedata,
  tokenlist: Tokendata[],
  voteEnd: number,
  snapshot: string
): Promise<SingleOffer> {
  const choice = bribe.voteindex + 1;
  const rewards = bribe.reward;

  const snapshotVotesPerPool = await getSnapshotVotesPerPool(snapshot);
  if (!snapshotVotesPerPool)
    return {
      usdPer1000Vp: 0,
      rewardAmount: 0,
      percent: 0,
      votes: 0,
      usdPerVp: 0,
      label: "can't get Data for pool",
      underminimum: false,
    };

  // votes, percent
  const { votes, percent } = snapshotVotesPerPool.find(x => x.poolId === choice.toString()) || {
    votes: 0,
    percent: 0,
  };
  const minpercent = bribe.payoutthreshold && bribe.payoutthreshold < 0 ? 0 : 0.15;
  if (percent < minpercent)
    return {
      usdPer1000Vp: 0,
      rewardAmount: 0,
      percent,
      votes: Math.round(votes),
      usdPerVp: 0,
      label: "under minimum",
      underminimum: true,
    };

  // rewardAmount
  const voteClosed = voteEnd <= Math.floor(Date.now() / 1000);
  let rewardAmount = 0;
  let label = "";
  for (const reward of rewards) {
    let usdValue = 1;
    if (!reward.isfixed) {
      const tokendata = tokenlist.find(x => x.token === reward.token);
      if (!tokendata) {
        // console.log(`Tokendata for ${reward.token} not found`);
        usdValue = 0;
      } else if (tokendata.lastprice) {
        // console.log(`lastprice: ${tokendata.lastprice}`);
        usdValue = tokendata.lastprice;
      } else if (voteClosed) {
        usdValue = await getCoinGeckoHistoryOldMethod(reward.token, voteEnd);
        // console.log(`CG price: ${usdValue}`);
      } else {
        if (!tokendata.tokenaddress) {
          usdValue = 0;
        } else {
          usdValue = await getRpcPrice(tokendata.tokenaddress);
          // console.log(`RPC price: ${usdValue}`);
        }
      }
    }
    usdValue *= reward.amount;

    switch (reward.type) {
      case "fixed":
        rewardAmount += usdValue;
        label = "Fixed Reward Amount";
        break;
      case "percent":
        // thresholds
        let threshold = bribe.percentagethreshold ?? 0;
        if (bribe.payoutthreshold && bribe.payoutthreshold > 0) threshold = bribe.payoutthreshold;
        if (percent > threshold) rewardAmount += usdValue * (percent - threshold);
        label = "Percent Amount";
        break;
      case "pervote":
        rewardAmount += usdValue * votes;
        label = "Per Vote Amount";
        break;
    }
  }
  if (rewards.length > 1) label = "Overall Amount";

  //check rewardcap
  if (bribe.rewardcap && rewardAmount > bribe.rewardcap) rewardAmount = bribe.rewardcap;

  // usdPerVp, UsdPer1000Vp
  const usdPerVp = Number((rewardAmount / votes).toFixed(7));
  const usdPer1000Vp = Number((usdPerVp * 1000).toFixed(2));

  return {
    usdPer1000Vp,
    rewardAmount: Math.round(rewardAmount),
    percent: Number(percent.toFixed(2)),
    votes: Math.round(votes),
    usdPerVp,
    label,
    underminimum: false,
  };
}
