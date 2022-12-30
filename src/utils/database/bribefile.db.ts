import clientPromise from "./mongodb";
import { Bribefile } from "utils/api/bribedata.model";

export async function readOneBribefile(
  round: number
): Promise<Bribefile | null> {
  const client = await clientPromise;
  const coll = client.db("beetswars").collection<Bribefile>("bribedata");
  const item = await coll.findOne<Bribefile>(
    { round: round },
    { projection: { _id: 0 } }
  );
  if (!item) return null;
  return item;
}

export async function readAllBribefile(): Promise<Bribefile[] | null> {
  const client = await clientPromise;
  const coll = client.db("beetswars").collection<Bribefile>("bribedata");
  const items = await coll
    .find<Bribefile>({}, { projection: { _id: 0 } })
    .toArray();
  if (!items || items.length === 0) return null;
  return items;
}

export async function readKeyListBribefile(): Promise<string[]> {
  return [] as string[];
}

export async function insertBribefile(
  payload: Bribefile,
  round: number
): Promise<Bribefile | null> {
  const client = await clientPromise;
  const coll = client.db("beetswars").collection<Bribefile>("bribedata");
  const { value, ok } = await coll.findOneAndReplace(
    { round: round },
    payload,
    { upsert: true, returnDocument: "after" }
  );
  if (!ok || !value) return null;
  const { _id, ...result } = value;
  return result;
}

export async function removeBribefile(round: number): Promise<boolean> {
  const client = await clientPromise;
  const coll = client.db("beetswars").collection<Bribefile>("bribedata");
  const { deletedCount } = await coll.deleteOne({ round: round });
  return deletedCount === 1;
}
