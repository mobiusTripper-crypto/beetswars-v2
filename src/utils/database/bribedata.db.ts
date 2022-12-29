import clientPromise from "./mongodb";
import { Bribefile } from "utils/api/bribedata.model";

export async function readOne(round: number): Promise<Bribefile | null> {
  const client = await clientPromise;
  const coll = client.db("beetswars").collection<Bribefile>("bribedata");
  const item = await coll.findOne<Bribefile>({ round: round });
  if (!item) return null;
  console.log(item);
  return null;
}

export async function readAll(): Promise<Bribefile[] | null> {
  //     const client = await clientPromise;
  //     const coll = client.db("beetswars").collection<T>(collection);
  //     const items = await coll.find<T>().toArray();
  return null;
}

export async function readKeyList(): Promise<string[]> {
  return [] as string[];
}

export async function insert(payload: Bribefile): Promise<Bribefile | null> {
  return null;
}

export async function remove(round: number): Promise<boolean> {
  return false;
}
