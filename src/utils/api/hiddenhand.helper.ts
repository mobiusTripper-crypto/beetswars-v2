import type { HiddenhandBribe } from "types/hiddenhand.raw";
import { readOneBribefile } from "utils/database/bribefile.db";
import { findConfigEntry } from "utils/database/config.db";
import { getHiddenhandBribes } from "utils/externalData/hiddenhand";
import { getSnapshotProposal } from "utils/externalData/snapshot";

export default async function processHiddenhandApi(): Promise<string[]> {
  const successList = [] as string[];
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
  // foreach API entry
  apidata.forEach(prop => {
    // ignore if totalvalue is 0
    if (prop.totalValue !== 0) {
      // reduce token in bribes (add duplicate entries for same token)
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
      // console.log(reducedBribes);
      // foreach token in reduced bribes
      reducedBribes.forEach(bribe => {
        // check if token exists
        const tokens = bribefile?.tokendata || [];
        const foundToken = tokens.find(
          tok => tok.token.toLowerCase() == bribe.symbol.toLowerCase()
        );
        if (!foundToken) {
          // add token if not ##TODO##
        }
        const BWbribes = bribefile?.bribedata || [];
        // check if bribe exists
        console.log(BWbribes);
        const foundBribe = BWbribes.find(offer => offer.voteindex + 1 == Number(prop.index));
        if (!foundBribe) {
          // if not add bribe ##TODO##
          successList.push("Bribe added for " + prop.title);
        } else {
          successList.push("Bribe found " + prop.title);

          // check if amount equals saved bribe
          const foundBribeToken = foundBribe.reward.find(
            tok => tok.token.toLowerCase() == bribe.symbol.toLowerCase()
          );
          if (!foundBribeToken) {
            // add bribe for token with amount ##TODO##
            successList.push("Add bribe to " + prop.title + " using token " + bribe.symbol);
          } else if (foundBribeToken.amount != bribe.amount) {
            // update amount ##TODO##
            successList.push(
              "Updated bribe amount to " + prop.title + " using token " + bribe.symbol
            );
          }
        }
      });
    } else {
      successList.push("Entry " + prop.index + " has no offers.");
    }
  });

  return successList;
}
