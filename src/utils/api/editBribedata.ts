import { Bribedata, Bribefile, Tokendata } from "types/bribedata.raw";
import { insertBribefile, readOneBribefile } from "utils/database/bribefile.db";

export async function addRound(payload: Bribefile): Promise<Bribefile | null> {
  try {
    Bribefile.parse(payload);
    const round = payload.round;
    const result = await insertBribefile(payload, round);
    if (!result) return null;
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function editRound(payload: Bribefile): Promise<Bribefile | null> {
  try {
    Bribefile.parse(payload);
    const round = payload.round;
    const oldBribefile = await readOneBribefile(round);
    if (!oldBribefile) return null;
    // do not touch omitted parameters:
    const newBribefile = { ...oldBribefile, ...payload };
    const result = await insertBribefile(newBribefile, round);
    if (!result) return null;
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function addToken(
  payload: Tokendata,
  round: number
): Promise<Tokendata[] | null> {
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
    const result = await insertBribefile(bribefile, round);
    if (!result) return null;
    return result.tokendata;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function editToken(
  payload: Tokendata,
  round: number
): Promise<Tokendata[] | null> {
  try {
    const newToken = Tokendata.parse(payload);
    const bribefile = await readOneBribefile(round);
    if (!bribefile) return null;
    const { tokendata, ...rest } = bribefile;
    if (tokendata.length === 0) return null;
    const tokenArray = tokendata.map((item) => {
      return item.tokenId === newToken.tokenId ? newToken : item;
    });
    const newPayload = { ...rest, tokendata: tokenArray };
    const result = await insertBribefile(newPayload, round);
    if (!result?.tokendata) return null;
    return result.tokendata;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function deleteToken(
  tokenId: number,
  round: number
): Promise<boolean> {
  try {
    const bribefile = await readOneBribefile(round);
    if (!bribefile) return false;
    const newTokens = bribefile.tokendata.filter(
      (token) => token.tokenId !== tokenId
    );
    const newBribefile = { ...bribefile, tokendata: newTokens };
    const result = await insertBribefile(newBribefile, round);
    return !!result;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function addOffer(
  payload: Bribedata,
  round: number
): Promise<Bribedata[] | null> {
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
    const result = await insertBribefile(bribefile, round);
    if (!result) return null;
    return result.bribedata;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function editOffer(
  payload: Bribedata,
  round: number
): Promise<Bribedata[] | null> {
  try {
    const newOffer = Bribedata.parse(payload);
    const bribefile = await readOneBribefile(round);
    if (!bribefile) return null;
    const { bribedata, ...rest } = bribefile;
    if (bribedata.length === 0) return null;
    const bribeArray = bribedata.map((item) => {
      return item.offerId === newOffer.offerId ? newOffer : item;
    });
    const newPayload = { ...rest, bribedata: bribeArray };
    const result = await insertBribefile(newPayload, round);
    if (!result?.bribedata) return null;
    return result.bribedata;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function deleteOffer(
  offerId: number,
  round: number
): Promise<boolean> {
  try {
    const bribefile = await readOneBribefile(round);
    if (!bribefile) return false;
    const newOffers = bribefile.bribedata.filter(
      (offer) => offer.offerId !== offerId
    );
    const newBribefile = { ...bribefile, bribedata: newOffers };
    const result = await insertBribefile(newBribefile, round);
    return !!result;
  } catch (error) {
    console.error(error);
    return false;
  }
}
