import type { Reward } from "types/bribedata.raw";
import { type Tokendata } from "types/bribedata.raw";
import type { HiddenhandBribe } from "types/hiddenhand.raw";
import { readOneBribefile } from "utils/database/bribefile.db";
import { findConfigEntry } from "utils/database/config.db";
import { getHiddenhandBribes } from "utils/externalData/hiddenhand";
import { getSnapshotProposal } from "utils/externalData/snapshot";
import { addToken, addOffer, addReward, editReward } from "./editBribedata";

export default async function processHiddenhandApi(): Promise<string[]> {
  const messageList = [] as string[];
  const latest = await findConfigEntry("latest");
  // console.log("latest: ", latest);
  const round = Number(latest) || 0;
  // get bribefile
  const bribefile = await readOneBribefile(round);
  // read voteend
  const proposal = bribefile?.snapshot;
  const snapshot = await getSnapshotProposal(proposal || "");
  const voteend = snapshot?.end;
  // get API data
  const apidata = await getHiddenhandBribes();
  // check if API->voteend equals bribefile->voteend
  const voteend2 = apidata[0]?.proposalDeadline || -1;
  // return on error
  if (voteend != voteend2) return ["Error: API data not valid for latest round"];
  //#################################
  //  PART 1: Tokens
  //#################################
  let tokenList = [] as Tokendata[];
  const nameList = [] as string[];
  // read
  apidata.forEach(prop => {
    if (prop.bribes.length > 0) {
      prop.bribes.forEach(bribe => {
        if (!nameList.includes(bribe.symbol)) {
          nameList.push(bribe.symbol);
          const newToken: Tokendata = {
            token: bribe.symbol,
            tokenaddress: bribe.token,
            tokenId: 0,
          };
          // special guests
          if (newToken.token == "deus") newToken.coingeckoid = "deus-finance-2";
          if (newToken.token == "bpt-lzfoto") {
            newToken.isbpt = true;
            newToken.tokenaddress = "0x838229095fa83bcd993ef225d01a990e3bc197a800020000000000000000075b";
            newToken.bptpoolid = "0x838229095fa83bcd993ef225d01a990e3bc197a800020000000000000000075b";
          }
          tokenList.push(newToken);
        }
      });
    }
  });

  // compare
  const BWtokens = bribefile?.tokendata || [];
  BWtokens.forEach(tkn => {
    tokenList = tokenList.filter(item => item.token != tkn.token);
  });
  console.log(tokenList);

  // write
  tokenList.forEach(async tkn => {
    const tokenResult = await addToken(tkn, round);
    if (!tokenResult) {
      messageList.push("Adding token failed: " + tkn.token);
    } else {
      messageList.push("Adding token: " + tkn.token);
    }
  });

  //#################################
  //  PART 2: Bribes
  //#################################

  // foreach API entry
  const BWbribes = bribefile?.bribedata || [];
  apidata.forEach(async prop => {
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
        BWnewBribe = {
          voteindex: Number(prop.index) - 1,
          poolname: prop.title,
          poolurl: "",
          rewarddescription: "",
          offerId: 0,
          reward: [],
        };
        const bribeResult = await addOffer(BWnewBribe, round);
        if (!bribeResult) {
          messageList.push("Adding bribe failed: " + prop.title);
        } else {
          messageList.push("Adding bribe: " + prop.title);
          BWnewBribe = bribeResult.find(res => res.poolname == prop.title); // now containing offerId
        }
      } else messageList.push("Bribe found " + prop.title);

      // foreach token in reduced bribes
      reducedBribes.forEach(bribetoken => {
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
            rewardId: 0,
            isProtocolBribe: false,
          };
          addReward(newReward, round, BWnewBribe?.offerId || 0);
          messageList.push("Add bribe to " + prop.title + " using token " + bribetoken.symbol);
        } else if (foundBribeToken.amount != bribetoken.amount) {
          // update amount 
          foundBribeToken.amount = bribetoken.amount;
          editReward(foundBribeToken, round, BWnewBribe?.offerId || 0);
          messageList.push(
            "Updated bribe amount to " + prop.title + " using token " + bribetoken.symbol
          );
        }
      });
    } else {
      // totalValue == 0
      messageList.push("Entry " + prop.index + " has no offers.");
    }
  });

  return messageList;
}
// 0xde55b113a27cc0c5893caa6ee1c020b6b46650c0
// deus-finance-2
// 0x838229095fa83bcd993ef225d01a990e3bc197a8
// 0x838229095fa83bcd993ef225d01a990e3bc197a800020000000000000000075b
