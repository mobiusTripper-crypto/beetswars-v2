import type { Chartdata } from "../../types/chartdata.raw";
import { getSnapshotProposal, getSnapshotVotes } from "../externalData/snapshot";
import { readOneBribefile } from "utils/database/bribefile.db";
import { getEmissionForRound } from "./bribeApr.helper";
import { getPrice } from "utils/externalData/pricefeed";
import { getRelicsFbeetsLocked } from "utils/externalData/theGraph";
import { editToken } from "./editBribedata";

// const FIRST_ROUND_FOR_RECLICS = 32;

export async function getData(round: number) {
  const newData = {} as Chartdata;
  newData.round = round;

  // gather basics
  const bribefile = await readOneBribefile(round);
  if (!bribefile) return newData; //empty
  const proposal = bribefile.snapshot;
  const bribedOffers = bribefile.bribedata.map(x => (x.voteindex + 1).toString());
  const externallyBribedOffers = bribefile.bribedata
    .filter(bribedPool => {
      return bribedPool.reward.some(reward => reward.isProtocolBribe === false);
    })
    .map(x => (x.voteindex + 1).toString());
  const prop = await getSnapshotProposal(proposal);
  const votes = await getSnapshotVotes(proposal);
  if (!prop) return newData;
  const { end } = prop;
  const totalVoter = votes.length;

  // calculate bribed votes
  const poolVotes: { [key: string]: number } = {};
  votes.forEach(({ choice, vp }) => {
    const total = Object.values(choice).reduce((a, b) => a + b);
    for (const [key, value] of Object.entries(choice)) {
      poolVotes[key] = (poolVotes[key] || 0) + (vp * value) / total;
    }
  });
  const totalVotes = Math.round(Object.values(poolVotes).reduce((a, b) => a + b));
  const bribedVotes = Math.round(bribedOffers.reduce((sum, x) => sum + (poolVotes[x] || 0), 0));
  const externallyBribedVotes = Math.round(
    externallyBribedOffers.reduce((sum, x) => sum + (poolVotes[x] || 0), 0)
  );

  // calculate prices
  const priceBeets = await getPrice(
    true,
    {
      token: "BEETS", tokenaddress: '0x2d0e0814e62d80056181f5cd932274405966e4f0', coingeckoid: "beethoven-x",
      tokenId: 0
    },
    end
  );
  const priceFbeets =
      await getPrice(
          true,
          {
            token: "FBEETS",
            tokenId: 0,
            tokenaddress: "0x10ac2f9dae6539e77e372adb14b1bf8fbd16b3e8000200000000000000000005", // on sonic
            isbpt: true,
          },
          end
        );

  let pricePerVp = priceFbeets;
    const block = parseInt(prop.snapshot,10);
    const addresses = votes.map(x => x.voter.toLowerCase());
    const fbeetsLocked = await getRelicsFbeetsLocked(block, addresses);
    const result = (priceFbeets * fbeetsLocked) / totalVotes;
    pricePerVp = result;

  // store to lastprice
  if (priceBeets > 0) {
    const newTokenData = bribefile.tokendata.find(x => x.token === "BEETS");
    if (newTokenData && !newTokenData.lastprice) {
      newTokenData.lastprice = priceBeets;
      await editToken(newTokenData, round);
    }
  }

  // calculate total bribes
  const bribes = bribedOffers.map(x => {
    const key = x;
    const votes = poolVotes[x] || 0;
    const percent = (votes * 100) / totalVotes;
    const usd = 0;
    const usdExternal = 0;
    return { key, votes, percent, usd, usdExternal };
  });
  for (const bribe of bribefile.bribedata) {
    const rewardcap = bribe.rewardcap || Infinity;
    let sum = 0;
    let sumExternal = 0;
    const key = (bribe.voteindex + 1).toString();
    let bribeEntry = bribes.find(x => x.key === key); // eslint-disable-line prefer-const
    if (!bribeEntry) break;
    const index = bribes.indexOf(bribeEntry);
    for (const reward of bribe.reward) {
      let amount = reward.amount;
      if (!reward.isfixed) {
        if (reward.token === "BEETS") {
          amount *= priceBeets;
        } else {
          const rewardtoken = bribefile.tokendata.find(x => x.token === reward.token);
          if (rewardtoken) {
            const price = await getPrice(true, rewardtoken, end);
            if (price > 0 && !rewardtoken.lastprice) {
              // store to lastprice
              rewardtoken.lastprice = price;
              await editToken(rewardtoken, round);
            }
            amount *= price;
          } else amount = 0;
        }
      }
      // now we have amount in USD
      if (reward.type === "fixed") {
        sum += amount;
        sumExternal += reward.isProtocolBribe ? 0 : amount;
      } else if (reward.type === "percent") {
        let percent = bribeEntry.percent;
        if (percent < 0.15 && bribe.payoutthreshold !== -1) {
          percent = 0;
        } else if (bribe.percentagethreshold) {
          percent = Math.max(0, bribeEntry.percent - bribe.percentagethreshold);
        } else if (bribe.payoutthreshold && bribe.payoutthreshold > 0) {
          percent = Math.max(0, bribeEntry.percent - bribe.payoutthreshold);
        }
        sum += amount * percent;
        sumExternal += (reward.isProtocolBribe ? 0 : amount) * percent;
      } else if (reward.type === "pervote") {
        sum += amount * bribeEntry.votes;
        sumExternal += (reward.isProtocolBribe ? 0 : amount) * bribeEntry.votes;
      }
    }
    bribeEntry.usd = Math.min(sum, rewardcap);
    bribeEntry.usdExternal = Math.min(sumExternal, rewardcap);
    bribes[index] = bribeEntry;
  }
  const totalBribes = Math.round(bribes.reduce((sum, x) => sum + x.usd, 0));
  const totalExternalBribes = Math.round(bribes.reduce((sum, x) => sum + x.usdExternal, 0));
  const emissions = await getEmissionForRound(round);
  // const emissions = 300000; // hardcoded for now
  const bribersRoi = emissions?.avgBribeRoiInPercent ?? 0;

  // fill data
  newData.totalVoter = totalVoter;
  newData.totalVotes = totalVotes;
  newData.totalBriber = bribedOffers.length;
  newData.totalBribes = totalBribes;
  newData.totalExternalBribes = totalExternalBribes;
  newData.bribedVotes = bribedVotes;
  newData.externallyBribedVotes = externallyBribedVotes;
  newData.voteEnd = end;
  newData.priceBeets = priceBeets;
  newData.priceFbeets = priceFbeets;
  newData.pricePerVp = pricePerVp;
  newData.bribersRoi = bribersRoi;

  return newData;
}
