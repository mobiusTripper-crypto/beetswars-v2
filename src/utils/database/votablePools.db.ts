import type { VotablePool } from "types/votablePools.raw";
import clientPromise from "./mongodb";

const dbName = process.env.DB_NAME;

export async function readOnePoolentry(
  round: number,
  voteindex: number
): Promise<VotablePool | null> {
  try {
    const client = await clientPromise;
    const coll = client.db(dbName).collection<VotablePool>("votepools");
    const item = await coll.findOne<VotablePool>({ round, voteindex }, { projection: { _id: 0 } });
    if (!item) return null;
    return item;
  } catch (error) {
    console.error("failed readOnePoolentry", error);
    return null;
  }
}

export async function readRoundPoolentries(round: number): Promise<VotablePool[] | null> {
  try {
    if (!round) return null;
    const client = await clientPromise;
    const coll = client.db(dbName).collection<VotablePool>("votepools");
    const items = await coll
      .find<VotablePool>({ round }, { projection: { _id: 0 } })
      .sort({ voteindex: 1 })
      .toArray();
    if (!items) return null;
    return items;
  } catch (error) {
    console.error("failed readRoundPoolentries", error);
    return null;
  }
}

export async function insertPoolentries(payload: VotablePool[]): Promise<VotablePool[] | null> {
  let error = false;
  try {
    const client = await clientPromise;
    const coll = client.db(dbName).collection<VotablePool>("votepools");
    const result: VotablePool[] = [];
    for (const pool of payload) {
      const { value, ok } = await coll.findOneAndReplace(
        { round: pool.round, voteindex: pool.voteindex },
        pool,
        {
          upsert: true,
          returnDocument: "after",
        }
      );
      if (!ok || !value) {
        error = true;
        break;
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id, ...newEntry } = value;
        result.push(newEntry);
      }
    }
    if (error) return null;
    return result;
  } catch (e) {
    console.error("failed insertPoolentries: ", e);
    return null;
  }
}

export async function removePoolentry(round: number, voteindex: number): Promise<boolean> {
  try {
    const client = await clientPromise;
    const coll = client.db(dbName).collection<VotablePool>("votepools");
    const { deletedCount } = await coll.deleteOne({ round, voteindex });
    return deletedCount === 1;
  } catch (error) {
    console.error("failed removeChartdata: ", error);
    return false;
  }
}
