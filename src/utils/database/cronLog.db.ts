import clientPromise from "./mongodb";
import type { CronLog } from "types/cronLog.raw";

const dbName = process.env.DB_NAME;

export async function readAllCronLogs(): Promise<CronLog[]> {
  const client = await clientPromise;
  const coll = client.db(dbName).collection<CronLog>("cronLog");
  const items = await coll
    .find<CronLog>({}, { projection: { _id: 0 } })
    .sort({ timestamp: -1 })
    .toArray();
  if (!items) return [];
  return items;
}

export async function insertCronLog(entry: CronLog): Promise<boolean> {
  try {
    const client = await clientPromise;
    const coll = client.db(dbName).collection<CronLog>("cronLog");
    const { acknowledged } = await coll.insertOne(entry);
    return acknowledged;
  } catch (error) {
    console.error("failed insertCronLog", error);
    return false;
  }
}
