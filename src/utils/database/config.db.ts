import clientPromise from "./mongodb";
import type { Config } from "types/config.raw";

const dbName = process.env.DB_NAME;

export async function findConfigEntry(key: string): Promise<string | null> {
  const client = await clientPromise;
  const coll = client.db(dbName).collection<Config>("config");
  const item = await coll.findOne<Config>({ name: key }, { projection: { _id: 0 } });
  if (!item) return null;
  return item.data;
}

export async function setConfigEntry(data: Config): Promise<boolean> {
  try {
    const client = await clientPromise;
    const coll = client.db(dbName).collection<Config>("config");
    const { ok } = await coll.findOneAndReplace({ name: data.name }, data, {
      upsert: true,
    });
    return !!ok;
  } catch (error) {
    console.error("failed setConfigEntry", error);
    return false;
  }
}
