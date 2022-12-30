import clientPromise from "./mongodb";
import { Chartdata } from "../api/chartdata.model";

export async function readOneChartdata(
  round: string
): Promise<Chartdata | null> {
  const client = await clientPromise;
  const coll = client.db("beetswars").collection<Chartdata>("chartdata");
  const item = await coll.findOne<Chartdata>({ round: round });
  if (!item) return null;
  console.log(item);
  return item;
}

export async function readAllChartdata(): Promise<Chartdata[] | null> {
  const client = await clientPromise;
  const coll = client.db("beetswars").collection<Chartdata>("chartdata");
  const items = await coll.find<Chartdata>({}).toArray();
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
    { upsert: true }
  );
  if (!ok) return null;
  return value;
}

export async function removeChartdata(round: string): Promise<boolean> {
  const client = await clientPromise;
  const coll = client.db("beetswars").collection<Chartdata>("chartdata");
  const { deletedCount } = await coll.deleteOne({ round: round });
  return deletedCount === 1;
}
