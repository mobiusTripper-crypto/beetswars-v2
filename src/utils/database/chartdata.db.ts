import clientPromise from "./mongodb";
import type { ChartdataV1, Chartdata } from "../../types/chartdata.raw";

const dbName = process.env.DB_NAME;

export async function readOneChartdata(round: number): Promise<Chartdata | null> {
  try {
    const client = await clientPromise;
    const coll = client.db(dbName).collection<Chartdata>("chartdata");
    const item = await coll.findOne<Chartdata>({ round: round }, { projection: { _id: 0 } });
    if (!item) return null;
    return item;
  } catch (error) {
    console.error("failed readOneChartdata", error);
    return null;
  }
}

export async function readOneChartdataV1(round: number): Promise<ChartdataV1 | null> {
  try {
    const roundstr = typeof round === "string" ? round : round.toString().padStart(2, "0");
    const client = await clientPromise;
    const coll = client.db(dbName).collection<Chartdata>("chartdata");
    const item = await coll.findOne<Chartdata>({ round: +roundstr }, { projection: { _id: 0 } });
    if (!item) return null;
    const newItem: ChartdataV1 = { ...item, round: roundstr };
    return newItem;
  } catch (error) {
    console.error("failed readOneChartdata", error);
    return null;
  }
}

export async function readAllChartdata(): Promise<Chartdata[] | null> {
  try {
    const client = await clientPromise;
    const coll = client.db(dbName).collection<Chartdata>("chartdata");
    const items = await coll
      .find<Chartdata>({}, { projection: { _id: 0 } })
      .sort({ voteEnd: 1 })
      .toArray();
    if (!items || items.length === 0) return null;
    return items;
  } catch (error) {
    console.error("failed readAllChartdata", error);
    return null;
  }
}

export async function readAllChartdataV1(): Promise<ChartdataV1[] | null> {
  try {
    const client = await clientPromise;
    const coll = client.db(dbName).collection<Chartdata>("chartdata");
    const items = await coll
      .find<Chartdata>({}, { projection: { _id: 0 } })
      .sort({ voteEnd: 1 })
      .toArray();
    if (!items || items.length === 0) return null;
    const result = items.map(item => {
      return { ...item, round: item.round.toString().padStart(2, "0") } as ChartdataV1;
    });
    return result;
  } catch (error) {
    console.error("failed readAllChartdata", error);
    return null;
  }
}

export async function insertChartdata(
  payload: Chartdata,
  round: number
): Promise<Chartdata | null> {
  try {
    const client = await clientPromise;
    const coll = client.db(dbName).collection<Chartdata>("chartdata");
    const { value, ok } = await coll.findOneAndReplace({ round: round }, payload, {
      upsert: true,
      returnDocument: "after",
    });
    if (!ok || !value) return null;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...result } = value;
    return result;
  } catch (error) {
    console.error("failed insertChartdata: ", error);
    return null;
  }
}

export async function removeChartdata(round: number): Promise<boolean> {
  try {
    const client = await clientPromise;
    const coll = client.db(dbName).collection<Chartdata>("chartdata");
    const { deletedCount } = await coll.deleteOne({ round: round });
    return deletedCount === 1;
  } catch (error) {
    console.error("failed removeChartdata: ", error);
    return false;
  }
}
