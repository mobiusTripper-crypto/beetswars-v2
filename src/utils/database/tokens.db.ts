import type { Tokendata } from "types/bribedata.raw";
import clientPromise from "./mongodb";

const dbName = process.env.DB_NAME;

export async function findTokenEntry(address: string): Promise<Tokendata | null> {
  const client = await clientPromise;
  const coll = client.db(dbName).collection<Tokendata>("tokens");
  const item = await coll.findOne<Tokendata>({ tokenaddress: address }, { projection: { _id: 0 } });
  if (!item) return null;
  return item;
}

export async function setTokenEntry(data: Tokendata): Promise<boolean> {
  if (!data.tokenaddress) return false; // cannot save without address
  try {
    const client = await clientPromise;
    const coll = client.db(dbName).collection<Tokendata>("tokens");
    const { ok } = await coll.findOneAndReplace({ tokenaddress: data.tokenaddress }, data, {
      upsert: true,
    });
    return !!ok;
  } catch (error) {
    console.error("failed setConfigEntry", error);
    return false;
  }
}

export async function updateTokenPriceCache(address: string, cacheprice: number, cachetimestamp: number): Promise<void> {
  const client = await clientPromise;
  const cacheCollection = client.db(dbName).collection<Tokendata>("tokens");
  await cacheCollection.updateOne(
    { address },
    { $set: { cacheprice, cachetimestamp } },
    { upsert: true }
  );
}

