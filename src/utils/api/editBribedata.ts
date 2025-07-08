import { Bribedata, Bribefile, Reward, Tokendata } from "types/bribedata.raw";
import type { Suggestion } from "types/offerSuggestions.trpc";
import { getSnapshotProposal } from "../externalData/snapshot";
import { insertBribefile, readOneBribefile, removeBribefile } from "utils/database/bribefile.db";
import { incPatch, setMajor, setMinor } from "./semVer.helper";
import type { Config } from "types/config.raw";
import { setConfigEntry } from "utils/database/config.db";

export async function addRound(payload: Bribefile): Promise<Bribefile | null> {
  try {
    Bribefile.parse(payload);
    const round = payload.round;
    payload.version = setMajor(round);
    const result = await insertBribefile(payload, round);
    if (!result) return null;
    // console.log("add round");
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function editRound(payload: Bribefile): Promise<Bribefile | null> {
  try {
    Bribefile.parse(payload);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { tokendata, bribedata, ...rest } = payload;
    const round = payload.round;
    const oldBribefile = await readOneBribefile(round);
    if (!oldBribefile) return null;
    rest.version = incPatch(oldBribefile.version);
    const newBribefile = { ...oldBribefile, ...rest };
    const result = await insertBribefile(newBribefile, round);
    if (!result) return null;
    // console.log("edit round");
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function deleteRound(round: number): Promise<boolean> {
  try {
    //remove bribefile from database
    const result = await removeBribefile(round);
    if (!result) return false;
    // set latest
    const entry: Config = { name: "latest", data: round - 1 }; // set latest round to previous
    const newLatest = await setConfigEntry(entry);
    if (!newLatest) return false;
    return result;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function addToken(payload: Tokendata, round: number): Promise<Tokendata[] | null> {
  try {
    const newToken = Tokendata.parse(payload);
    const bribefile = await readOneBribefile(round);
    if (!bribefile) return null;
    if (bribefile.tokendata.length === 0) {
      newToken.tokenId = 1;
    } else {
      newToken.tokenId =
        bribefile.tokendata.reduce((prev, current) => {
          return prev.tokenId > current.tokenId ? prev : current;
        }).tokenId + 1;
    }
    bribefile.tokendata.push(newToken);
    bribefile.version = incPatch(bribefile.version);
    const result = await insertBribefile(bribefile, round);
    if (!result) return null;
    // console.log("add token");
    return result.tokendata;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function editToken(payload: Tokendata, round: number): Promise<Tokendata[] | null> {
  try {
    const newToken = Tokendata.parse(payload);
    const bribefile = await readOneBribefile(round);
    if (!bribefile) return null;
    const { tokendata, ...rest } = bribefile;
    if (tokendata.length === 0) return null;
    const tokenArray = tokendata.map(item => {
      return item.tokenId === newToken.tokenId ? newToken : item;
    });
    rest.version = incPatch(bribefile.version);
    const newPayload = { ...rest, tokendata: tokenArray };
    const result = await insertBribefile(newPayload, round);
    if (!result?.tokendata) return null;
    // console.log("edit token");
    return result.tokendata;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function deleteToken(tokenId: number, round: number): Promise<boolean> {
  try {
    const bribefile = await readOneBribefile(round);
    if (!bribefile) return false;
    const newTokens = bribefile.tokendata.filter(token => token.tokenId !== tokenId);
    const newBribefile = { ...bribefile, tokendata: newTokens };
    newBribefile.version = incPatch(bribefile.version);
    const result = await insertBribefile(newBribefile, round);
    // console.log("delete token");
    return !!result;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function addOffer(payload: Bribedata, round: number): Promise<Bribedata[] | null> {
  try {
    const newOffer = Bribedata.parse(payload);
    const bribefile = await readOneBribefile(round);
    if (!bribefile) return null;
    if (bribefile.bribedata.length === 0) {
      newOffer.offerId = 1;
    } else {
      newOffer.offerId =
        bribefile.bribedata.reduce((prev, current) => {
          return prev.offerId > current.offerId ? prev : current;
        }).offerId + 1;
    }
    bribefile.bribedata.push(newOffer);
    bribefile.version = setMinor(bribefile.bribedata.length, bribefile.version);
    const result = await insertBribefile(bribefile, round);
    if (!result) return null;
    // console.log("add offer");
    return result.bribedata;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function editOffer(payload: Bribedata, round: number): Promise<Bribedata[] | null> {
  try {
    const newOffer = Bribedata.parse(payload);
    const bribefile = await readOneBribefile(round);
    if (!bribefile) return null;
    const { bribedata, ...rest } = bribefile;
    if (bribedata.length === 0) return null;
    const bribeArray = bribedata.map(item => {
      return item.offerId === newOffer.offerId ? newOffer : item;
    });
    rest.version = incPatch(bribefile.version);
    const newPayload = { ...rest, bribedata: bribeArray };
    const result = await insertBribefile(newPayload, round);
    if (!result?.bribedata) return null;
    // console.log("edit offer");
    return result.bribedata;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function deleteOffer(offerId: number, round: number): Promise<boolean> {
  try {
    const bribefile = await readOneBribefile(round);
    if (!bribefile) return false;
    const newOffers = bribefile.bribedata.filter(offer => offer.offerId !== offerId);
    const newBribefile = { ...bribefile, bribedata: newOffers };
    newBribefile.version = incPatch(setMinor(newOffers.length, bribefile.version));
    const result = await insertBribefile(newBribefile, round);
    // console.log("delete offer");
    return !!result;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function addReward(
  payload: Reward,
  round: number,
  offer: number
): Promise<Bribedata[] | null> {
  try {
    const newReward = Reward.parse(payload);
    const bribefile = await readOneBribefile(round);
    if (!bribefile) return null;
    const { bribedata, ...rest } = bribefile;
    const bribe = bribedata.find(item => item.offerId === offer);
    if (!bribe) return null;
    if (bribe.reward.length === 0) {
      newReward.rewardId = 1;
    } else {
      newReward.rewardId =
        bribe.reward.reduce((prev, current) => {
          return prev.rewardId > current.rewardId ? prev : current;
        }).rewardId + 1;
    }
    bribe.reward.push(newReward);
    const newBribedata = bribedata.map(item => (item.offerId === offer ? bribe : item));
    rest.version = incPatch(bribefile.version);
    const newBribefile = { ...rest, bribedata: newBribedata };
    const result = await insertBribefile(newBribefile, round);
    if (!result) return null;
    // console.log("add reward");
    return result.bribedata;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function editReward(
  payload: Reward,
  round: number,
  offer: number
): Promise<Bribedata[] | null> {
  try {
    const newReward = Reward.parse(payload);
    const bribefile = await readOneBribefile(round);
    if (!bribefile) return null;
    const { bribedata, ...rest } = bribefile;
    const bribe = bribedata.find(item => item.offerId === offer);
    if (!bribe) return null;
    bribe.reward = bribe.reward.map(item =>
      item.rewardId === newReward.rewardId ? newReward : item
    );
    const newBribedata = bribedata.map(item => (item.offerId === offer ? bribe : item));
    const newBribefile = { ...rest, bribedata: newBribedata };
    rest.version = incPatch(bribefile.version);
    const result = await insertBribefile(newBribefile, round);
    if (!result) return null;
    // console.log("edit reward");
    return result.bribedata;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function deleteReward(round: number, offer: number, reward: number): Promise<boolean> {
  try {
    const bribefile = await readOneBribefile(round);
    if (!bribefile) return false;
    const { bribedata, ...rest } = bribefile;
    const bribe = bribedata.find(item => item.offerId === offer);
    if (!bribe || bribe.reward.length < 2) return false;
    bribe.reward = bribe.reward.filter(item => item.rewardId !== reward);
    const newBribedata = bribedata.map(item => (item.offerId === offer ? bribe : item));
    rest.version = incPatch(bribefile.version);
    const newBribefile = { ...rest, bribedata: newBribedata };
    const result = await insertBribefile(newBribefile, round);
    // console.log("delete reward");
    return !!result;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function suggestData(round: number): Promise<Suggestion[]> {
  const thisRound = await readOneBribefile(round);
  if (!thisRound) return [];
  const snapData = await getSnapshotProposal(thisRound.snapshot);
  if (!snapData) return [];
  const lastRound = await readOneBribefile(round - 1);
  const result = snapData.choices.map(poolName => {
    // for every vote possibility check for previous data
    const previousData = lastRound?.bribedata.find(bribe => bribe.poolname === poolName) || null;
    const voteIndex = snapData.choices.indexOf(poolName);
    if (!previousData) return { round, poolName, voteIndex } as Suggestion;
    return { round, poolName, voteIndex, previousData } as Suggestion;
  });
  return result;
}

export async function suggestToken(round: number): Promise<Tokendata[]> {
  const lastRound = await readOneBribefile(round - 1);
  if (!lastRound) return [];
  const result = lastRound.tokendata.map(token => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { tokenId, lastprice, ...rest } = token;
    return { ...rest, tokenId: 0 };
  });
  return result;
}
