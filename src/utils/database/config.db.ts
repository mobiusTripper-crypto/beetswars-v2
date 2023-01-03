import clientPromise from "./mongodb";
import { Config } from "types/config.raw";

export async function findConfigEntry(key: string): Promise<string | null> {
  const client = await clientPromise;
  const coll = client.db("beetswars").collection<Config>("config");
  const item = await coll.findOne<Config>(
    { name: key },
    { projection: { _id: 0 } }
  );
  if (!item) return null;
  return item.data;
}

export async function setConfigEntry(data: Config): Promise<boolean> {
  const client = await clientPromise;
  const coll = client.db("beetswars").collection<Config>("config");
  const { ok } = await coll.findOneAndReplace({ name: data.name }, data, {
    upsert: true,
  });
  return !!ok;
}
