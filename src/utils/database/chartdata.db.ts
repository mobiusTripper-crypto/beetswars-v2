import clientPromise from "./mongodb";
import { Chartdata } from "../api/chartdata.model";

type WithId<T> = T & { _id: string };

export async function readOneChartdata(
  round: string
): Promise<Chartdata | null> {
  const client = await clientPromise;
  const coll = client.db("beetswars").collection<Chartdata>("chartdata");
  const item = await coll.findOne<Chartdata>(
    { round: round },
    { projection: { _id: 0 } }
  );
  if (!item) return null;
  return item;
}

export async function readAllChartdata(): Promise<Chartdata[] | null> {
  const client = await clientPromise;
  const coll = client.db("beetswars").collection<Chartdata>("chartdata");
  const items = await coll
    .find<Chartdata>({}, { projection: { _id: 0 } })
    .toArray();
  if (!items || items.length === 0) return null;
  return items;
}

export async function insertChartdata(
  payload: Chartdata,
  round: string
): Promise<Chartdata | null> {
  const client = await clientPromise;
  const coll = client.db("beetswars").collection<Chartdata>("chartdata");
  const { value, ok } = await coll.findOneAndReplace(
    { round: round },
    payload,
    { upsert: true, returnDocument: "after" }
  );
  if (!ok || !value) return null;
  const { _id, ...result } = value;
  return result;
}

export async function removeChartdata(round: string): Promise<boolean> {
  const client = await clientPromise;
  const coll = client.db("beetswars").collection<Chartdata>("chartdata");
  const { deletedCount } = await coll.deleteOne({ round: round });
  return deletedCount === 1;
}
