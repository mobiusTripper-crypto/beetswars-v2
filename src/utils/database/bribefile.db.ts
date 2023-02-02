import clientPromise from "./mongodb";
import type { Bribefile } from "types/bribedata.raw";

const dbName = process.env.DB_NAME;

export async function readOneBribefile(round: number): Promise<Bribefile | null> {
  console.log(dbName);
  try {
    const client = await clientPromise;
    const coll = client.db(dbName).collection<Bribefile>("bribedata");
    const item = await coll.findOne<Bribefile>({ round: round }, { projection: { _id: 0 } });
    if (!item) return null;
    return item;
  } catch (error) {
    console.error("failed readOneBribefile: ", error);
    return null;
  }
}

export async function readAllBribefile(): Promise<Bribefile[] | null> {
  try {
    const client = await clientPromise;
    const coll = client.db(dbName).collection<Bribefile>("bribedata");
    const items = await coll.find<Bribefile>({}, { projection: { _id: 0 } }).toArray();
    if (!items || items.length === 0) return null;
    return items;
  } catch (error) {
    console.error("failed readAllBribefile: ", error);
    return null;
  }
}

export async function insertBribefile(
  payload: Bribefile,
  round: number
): Promise<Bribefile | null> {
  try {
    const client = await clientPromise;
    const coll = client.db(dbName).collection<Bribefile>("bribedata");
    const { value, ok } = await coll.findOneAndReplace({ round: round }, payload, {
      upsert: true,
      returnDocument: "after",
    });
    if (!ok || !value) return null;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...result } = value;
    return result;
  } catch (error) {
    console.error("failed insertBribefile: ", error);
    return null;
  }
}

export async function removeBribefile(round: number): Promise<boolean> {
  try {
    const client = await clientPromise;
    const coll = client.db(dbName).collection<Bribefile>("bribedata");
    const { deletedCount } = await coll.deleteOne({ round: round });
    return deletedCount === 1;
  } catch (error) {
    console.error("failed removeBribefile: ", error);
    return false;
  }
}
