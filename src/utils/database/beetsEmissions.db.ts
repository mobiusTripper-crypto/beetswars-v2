import type { Emission } from "types/emission.raw";
import { checkEmissionChange } from "utils/api/emission.helper";
import { findConfigEntry, setConfigEntry } from "./config.db";
import clientPromise from "./mongodb";

const dbName = process.env.DB_NAME;

export async function readEmissionList(): Promise<Emission[]> {
  try {
    const client = await clientPromise;
    const coll = client.db(dbName).collection<Emission>("emissiondata");
    const items = await coll.find<Emission>({}, { projection: { _id: 0 } }).toArray(); // find all
    if (!items) return [];
    return items;
  } catch (error) {
    console.error("failed readLoginList", error);
    return [];
  }
}

// will not insert duplicate values
export async function addEmission(data: Emission): Promise<boolean> {
  try {
    const client = await clientPromise;
    const coll = client.db(dbName).collection<Emission>("emissiondata");
    const { block } = data;
    const { value, ok } = await coll.findOneAndReplace(
      { block }, // find
      data, // replace with
      { upsert: true, returnDocument: "after" } // add if not found
    );
    return !!ok && !!value;
  } catch (error) {
    console.error("failed addLogin", error);
    return false;
  }
}

export async function updateEmissionChange(): Promise<Emission[]> {
  try {
    const client = await clientPromise;
    const coll = client.db(dbName).collection<Emission>("emissiondata");
    const items = await coll.find<Emission>({}, { projection: { _id: 0 } }).toArray(); // find all

    // no action if last entry younger than 1 day
    const lastChange = await findConfigEntry("tsEmissionChange");
    if (!!lastChange && Number(lastChange) >= Math.floor(Date.now() / 1000) - 24 * 60 * 60)
      return items;

    const lastEmission = items.reduce(
      (max, x) => {
        return max.block > x.block ? max : x;
      },
      { block: 0, beets: 0, timestamp: 0 }
    );
    const data = await checkEmissionChange(lastEmission);
    await Promise.all(data.map(item => addEmission(item)));
    await setConfigEntry({ name: "tsEmissionChange", data: Math.floor(Date.now() / 1000) });
    return await coll.find<Emission>({}, { projection: { _id: 0 } }).toArray();
  } catch (error) {
    return [];
  }
}
