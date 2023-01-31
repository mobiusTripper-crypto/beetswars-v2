import clientPromise from "./mongodb";
import type { Chartdata } from "../../types/chartdata.raw";

// type WithId<T> = T & { _id: string };

export async function readOneChartdata(round: string): Promise<Chartdata | null> {
  try {
    const client = await clientPromise;
    const coll = client.db("beetswars").collection<Chartdata>("chartdata");
    const item = await coll.findOne<Chartdata>({ round: round }, { projection: { _id: 0 } });
    if (!item) return null;
    return item;
  } catch (error) {
    console.error("failed readOneChartdata", error);
    return null;
  }
}

export async function readAllChartdata(): Promise<Chartdata[] | null> {
  try {
    const client = await clientPromise;
    const coll = client.db("beetswars").collection<Chartdata>("chartdata");
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

export async function insertChartdata(
  payload: Chartdata,
  round: string
): Promise<Chartdata | null> {
  try {
    const client = await clientPromise;
    const coll = client.db("beetswars").collection<Chartdata>("chartdata");
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

export async function removeChartdata(round: string): Promise<boolean> {
  try {
    const client = await clientPromise;
    const coll = client.db("beetswars").collection<Chartdata>("chartdata");
    const { deletedCount } = await coll.deleteOne({ round: round });
    return deletedCount === 1;
  } catch (error) {
    console.error("failed removeChartdata: ", error);
    return false;
  }
}

export async function updateChartdata(round: string, roi: number): Promise<Chartdata | null> {
  try {
    const client = await clientPromise;
    const coll = client.db("beetswars").collection<Chartdata>("chartdata");
    const item = await coll.findOne<Chartdata>({ round: round }, { projection: { _id: 0 } });
    if (!item) return null;
    let { bribersRoi, ...other } = item; // eslint-disable-line prefer-const
    bribersRoi = roi;
    const newItem: Chartdata = { ...other, bribersRoi };
    //write
    const { value, ok } = await coll.findOneAndReplace({ round: round }, newItem, {
      upsert: true,
      returnDocument: "after",
    });
    if (!ok || !value) return null;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...result } = value;
    return result;
  } catch (error) {
    console.error("failed updateChartdata: ", error);
    return null;
  }
}
