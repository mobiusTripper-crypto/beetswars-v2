import type { Emission } from "types/emission.raw";
import { findEmissionChangeBlock } from "utils/api/bribeApr.helper";
import { getBlockByTs, getTsByBlock } from "utils/externalData/ftmScan";
import { getBeetsPerBlock } from "utils/externalData/theGraph";
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
    const lastEmission = items.reduce(
      (max, x) => {
        return max.block > x.block ? max : x;
      },
      { block: 0, beets: 0, timestamp: 0 }
    );
    const data = await checkEmissionChange(lastEmission);
    await Promise.all(data.map(item => addEmission(item)));
    return await coll.find<Emission>({}, { projection: { _id: 0 } }).toArray();
  } catch (error) {
    return [];
  }
}

async function checkEmissionChange(lastEmission: Emission): Promise<Emission[]> {
  const stepwidth = 40000;
  let block = lastEmission.block + stepwidth;
  const oldBeets = lastEmission.beets;
  const currentBlock = await getBlockByTs(Math.floor(Date.now() / 1000) - 60);
  const data = [] as Emission[];
  while (block < currentBlock + stepwidth) {
    const beets = await getBeetsPerBlock(block);
    if (!beets) break;
    if (beets !== oldBeets) {
      const newblock = await findEmissionChangeBlock(block - stepwidth, block);
      const timestamp = await getTsByBlock(newblock);
      data.push({ block: newblock, beets, timestamp });
      block = newblock;
    } else {
      block += stepwidth;
    }
  }
  return data;
}
