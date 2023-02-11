import type { BribeData } from "types/bribelist.trpc";
import clientPromise from "./mongodb";

const dbName = process.env.DB_NAME;

export async function readBribeDashboard(roundnumber: number): Promise<BribeData | null> {
  try {
    const client = await clientPromise;
    const coll = client.db(dbName).collection<BribeData>("bribedashboard");
    const item = await coll.findOne<BribeData>({ roundnumber }, { projection: { _id: 0 } });
    if (!item) return null;
    return item;
  } catch (error) {
    console.error("failed readLoginList", error);
    return null;
  }
}

export async function insertBribeDashboard(payload: BribeData): Promise<BribeData | null> {
  if (!payload) return null;
  try {
    const client = await clientPromise;
    const coll = client.db(dbName).collection<BribeData>("bribedashboard");
    const { value, ok } = await coll.findOneAndReplace(
      { roundnumber: payload.roundnumber },
      payload,
      {
        upsert: true,
        returnDocument: "after",
      }
    );
    if (!ok || !value) return null;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...result } = value;
    return result;
  } catch (error) {
    console.error("failed insertBribeDashboard: ", error);
    return null;
  }
}
