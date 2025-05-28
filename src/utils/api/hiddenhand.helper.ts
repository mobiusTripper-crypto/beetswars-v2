import type { Bribedata, Bribefile, Reward } from "types/bribedata.raw";
import type { Tokendata } from "types/bribedata.raw";
import type { HiddenhandBribe } from "types/hiddenhand.raw";
import { insertBribefile, readOneBribefile } from "utils/database/bribefile.db";
import { findConfigEntry } from "utils/database/config.db";
import { getHiddenhandBribes } from "utils/externalData/hiddenhand";
import { getSnapshotProposal } from "utils/externalData/snapshot";
import { incPatch, setMinor } from "./semVer.helper";
import { setTokenEntry } from "utils/database/tokens.db";
import { getAutomationData } from "utils/externalData/github";
import { getFancyPoolName } from "utils/externalData/beetsBack";

export default async function processHiddenhandApi(): Promise<Bribefile | string> {
  const latest = await findConfigEntry("latest");
  const round = Number(latest) || 0;
  // get bribefile
  const bribefile = await readOneBribefile(round);
  if (!bribefile) return "Error: Round data not found";
  // const lastbribes = await readOneBribefile(round - 1);

  // read voteend
  const proposal = bribefile?.snapshot;
  const snapshot = await getSnapshotProposal(proposal || "");
  const voteend = snapshot?.end;
  // get API data
  const automation = await getAutomationData(voteend || 0);
  if (!automation) return "Error: automation API data not found";

  const apidata = await getHiddenhandBribes();
  if (!apidata || !automation) return "Error: API data not found";
  // check if API->voteend equals bribefile->voteend
  const voteend2 = apidata[0]?.proposalDeadline || -1;
  if (voteend != voteend2) return "Error: API data not valid for latest round";

  //#################################
  //  PART 1: Tokens
  //#################################
  let tokenList = [] as Tokendata[];
  const nameList = [] as string[];
  const BWtokens = bribefile.tokendata;
  let nextTokenId =
    BWtokens.reduce((max, item) => (item.tokenId > max ? item.tokenId : max), 0) + 1;
  // read
  apidata.forEach(prop => {
    if (prop.bribes.length > 0) {
      prop.bribes.forEach(bribe => {
        if (!nameList.includes(bribe.symbol)) {
          nameList.push(bribe.symbol);
          const newToken: Tokendata = {
            token: bribe.symbol,
            tokenaddress: bribe.token,
            tokenId: nextTokenId,
          };
          tokenList.push(newToken);
          nextTokenId++;
        }
      });
    }
  });

  // compare
  BWtokens.forEach(tkn => {
    tokenList = tokenList.filter(item => item.token != tkn.token);
  });
  // fill BWtokens
  tokenList.forEach(tkn => {
    const dbres = setTokenEntry(tkn);
    if (!dbres) console.error("Could not save token to database");
    BWtokens.push(tkn);
  });
  // write back
  bribefile.tokendata = BWtokens;

  //#################################
  //  PART 2: Bribes
  //#################################

  // foreach API entry
  const BWbribes = bribefile.bribedata;
  let nextId = BWbribes.reduce((max, item) => (item.offerId > max ? item.offerId : max), 0) + 1;
  const NewBribes: Bribedata[] = [];
  // apidata.forEach(async prop => { // not async safe, may result in empty Array
  for (const prop of apidata) {
    // ignore if totalvalue is 0
    if (prop.totalValue !== 0) {
      // reduce token in bribes (sum up duplicate entries for same token)
      const rawBribes = prop.bribes;
      const reducedBribes = rawBribes.reduce((acc: HiddenhandBribe[], cur: HiddenhandBribe) => {
        const mybribe = acc.find(item => item.symbol === cur.symbol);
        if (mybribe) {
          mybribe.amount += cur.amount;
        } else {
          acc.push(cur);
        }
        return acc;
      }, []);

      // check for existing bribe entry or create one
      let BWnewBribe = BWbribes.find(offer => offer.voteindex + 1 == Number(prop.index));
      if (!BWnewBribe) {
        //// find URL from previous round, if given
        // const oldpool = lastbribes?.bribedata.find(oldOffer => oldOffer.poolname == prop.title);
        // const newUrl = oldpool?.poolurl || "";
        const autopool = automation.gauges.find(pool => pool.poolName == prop.title);
        const poolIdLength = autopool?.poolId.length || 0;
        let newUrl = "https://beets.fi/pools/"; //default URL
        if (poolIdLength > 0) {
          // if poolIdLength > 42, add "sonic/v2" + autopool.poolId to URL else "sonic/v3" + autopool.poolId
          newUrl +=
            poolIdLength > 42 ? "sonic/v2/" + autopool?.poolId : "sonic/v3/" + autopool?.poolId;
        }
        const fancyPoolName = (await getFancyPoolName(autopool?.poolId || "0")) || "";
        BWnewBribe = {
          voteindex: Number(prop.index) - 1,
          poolname: fancyPoolName,
          poolurl: newUrl,
          rewarddescription: "Vote for " + prop.title,
          offerId: nextId,
          reward: [],
          payoutthreshold: -1,
        };
        nextId++;
      }

      //#################################
      //  PART 2.1: Bribe-Offers
      //#################################

      // foreach token in reduced bribes
      let newDescription = "Vote for " + prop.title + " to get a share of";
      const newRewards: Reward[] = [];
      let nextRewardId =
        BWnewBribe.reward.reduce((max, item) => (item.rewardId > max ? item.rewardId : max), 0) + 1;
      reducedBribes.forEach(async bribetoken => {
        newDescription += " " + bribetoken.amount.toFixed() + " $" + bribetoken.symbol + " and";
        // check if amount equals saved bribe
        const foundBribeToken = BWnewBribe?.reward.find(
          tok => tok.token.toLowerCase() == bribetoken.symbol.toLowerCase()
        );
        if (!foundBribeToken) {
          // add bribe for token with amount
          const newReward: Reward = {
            token: bribetoken.symbol,
            amount: bribetoken.amount,
            type: "fixed",
            isfixed: false,
            rewardId: nextRewardId,
            isProtocolBribe: bribetoken.symbol == "bpt-lzfoto" || bribetoken.symbol == "bb-ftmmen",
          };
          // if (newReward)
          newRewards.push(newReward);
          nextRewardId++;
        } else if (foundBribeToken.amount != bribetoken.amount) {
          // update amount
          foundBribeToken.amount = bribetoken.amount;
          foundBribeToken.isProtocolBribe =
            bribetoken.symbol == "bpt-lzfoto" || bribetoken.symbol == "bb-ftmmen";
          newRewards.push(foundBribeToken);
        } else {
          newRewards.push(foundBribeToken);
        }
      });
      // update offer description and offer list
      BWnewBribe.rewarddescription = newDescription.slice(0, -4);
      BWnewBribe.reward = newRewards;
      //  Add to output
      NewBribes.push(BWnewBribe);
    }
  }
  bribefile.bribedata = NewBribes;

  const versionMinor = bribefile.version.split(".")[1];
  if (Number(versionMinor) !== NewBribes.length) {
    bribefile.version = setMinor(NewBribes.length, bribefile.version);
  } else {
    bribefile.version = incPatch(bribefile.version);
  }
  // write to db
  const result = await insertBribefile(bribefile, round);
  if (!result) return "Error writing to database";
  return result;
}
