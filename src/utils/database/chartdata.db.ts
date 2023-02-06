import clientPromise from "./mongodb";
import type { ChartdataV1, Chartdata2 } from "../../types/chartdata.raw";

const dbName = process.env.DB_NAME;

export async function readOneChartdata(round: number): Promise<Chartdata2 | null> {
  try {
    const client = await clientPromise;
    const coll = client.db(dbName).collection<Chartdata2>("chartdata");
    const item = await coll.findOne<Chartdata2>({ round: round }, { projection: { _id: 0 } });
    if (!item) return null;
    return item;
  } catch (error) {
    console.error("failed readOneChartdata", error);
    return null;
  }
}

export async function readOneChartdataV1(round: string | number): Promise<ChartdataV1 | null> {
  try {
    const roundstr = typeof round === "string" ? round : round.toString().padStart(2, "0");
    const client = await clientPromise;
    const coll = client.db(dbName).collection<Chartdata2>("chartdata");
    let item: Chartdata2 | null;
    item = await coll.findOne<Chartdata2>({ round: +roundstr }, { projection: { _id: 0 } });
    if (!item)
      item = await coll.findOne<Chartdata2>({ round: roundstr }, { projection: { _id: 0 } });
    if (!item) return null;
    if (typeof item.round === "number") item.round = item.round.toString().padStart(2, "0");
    return item as ChartdataV1;
  } catch (error) {
    console.error("failed readOneChartdata", error);
    return null;
  }
}

export async function readAllChartdata(): Promise<Chartdata2[] | null> {
  try {
    const client = await clientPromise;
    const coll = client.db(dbName).collection<Chartdata2>("chartdata");
    const items = await coll
      .find<Chartdata2>({}, { projection: { _id: 0 } })
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
    const coll = client.db(dbName).collection<Chartdata2>("chartdata");
    const items = await coll
      .find<Chartdata2>({}, { projection: { _id: 0 } })
      .sort({ voteEnd: 1 })
      .toArray();
    if (!items || items.length === 0) return null;
    const result: ChartdataV1[] = items.map(item => {
      if (typeof item.round === "number") item.round = item.round.toString().padStart(2, "0");
      return item as ChartdataV1;
    });
    return result;
  } catch (error) {
    console.error("failed readAllChartdata", error);
    return null;
  }
}

export async function insertChartdata(
  payload: Chartdata2,
  round: number
): Promise<Chartdata2 | null> {
  try {
    const client = await clientPromise;
    const coll = client.db(dbName).collection<Chartdata2>("chartdata");
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
    const roundstr = round.toString().padStart(2, "0");
    const client = await clientPromise;
    const coll = client.db(dbName).collection<Chartdata2>("chartdata");
    const return1 = await coll.deleteOne({ round: round });
    const return2 = await coll.deleteOne({ round: roundstr });
    const count = return1.deletedCount + return2.deletedCount;
    return count === 1;
  } catch (error) {
    console.error("failed removeChartdata: ", error);
    return false;
  }
}

// export async function updateChartdata(round: string, roi: number): Promise<Chartdata | null> {
//   try {
//     const client = await clientPromise;
//     const coll = client.db(dbName).collection<Chartdata>("chartdata");
//     const item = await coll.findOne<Chartdata>({ round: round }, { projection: { _id: 0 } });
//     if (!item) return null;
//     let { bribersRoi, ...other } = item; // eslint-disable-line prefer-const
//     bribersRoi = roi;
//     const newItem: Chartdata = { ...other, bribersRoi };
//     //write
//     const { value, ok } = await coll.findOneAndReplace({ round: round }, newItem, {
//       upsert: true,
//       returnDocument: "after",
//     });
//     if (!ok || !value) return null;
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     const { _id, ...result } = value;
//     return result;
//   } catch (error) {
//     console.error("failed updateChartdata: ", error);
//     return null;
//   }
// }
