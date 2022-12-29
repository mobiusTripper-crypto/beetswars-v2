import clientPromise from "./mongodb";
import { Chartdata } from "../api/chartdata.model";

type WithId<T> = T & { _id: string };

export async function readOne(round: string): Promise<Chartdata | null> {
  const client = await clientPromise;
  const coll = client.db("beetswars").collection<Chartdata>("chartdata");
  const item = await coll.findOne<Chartdata>({ round: round });
  if (!item) return null;
  console.log(item);
  return item;
}

export async function readAll(): Promise<Chartdata[] | null> {
  const client = await clientPromise;
  const coll = client.db("beetswars").collection<Chartdata>("chartdata");
  const items = await coll.find<Chartdata>({}).toArray();
  if (!items || items.length === 0) return null;
  return items;
}

export async function insert(payload: Chartdata): Promise<Chartdata | null> {
  const client = await clientPromise;
  const coll = client.db("beetswars").collection<Chartdata>("chartdata");
  const result = await coll.insertOne;
  return null;
}

export async function replace(
  round: number,
  payload: Chartdata
): Promise<Chartdata | null> {
  const client = await clientPromise;
  const coll = client.db("beetswars").collection<Chartdata>("chartdata");
  const result = await coll.insertOne;
  return null;
}

export async function remove(round: string): Promise<boolean> {
  return false;
}
