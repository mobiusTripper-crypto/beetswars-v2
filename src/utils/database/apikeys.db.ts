import clientPromise from "./mongodb";

type Apikey = {
  [key: number]: string;
};

const dbName = process.env.DB_NAME;

export async function readApiKeyList(): Promise<string[]> {
  try {
    const client = await clientPromise;
    const coll = client.db(dbName).collection<Apikey>("apikeys");
    const items = await coll.find<Apikey>({}).toArray();
    if (!items || items.length === 0) return [];
    const keylist = items.map(item => Object.values(item)[0]) as string[];
    return keylist;
  } catch (error) {
    console.error("failed readApiKeyList: ", error);
    return [];
  }
}

export async function addApikey(key: string): Promise<boolean> {
  try {
    const client = await clientPromise;
    const coll = client.db(dbName).collection<Apikey>("apikeys");
    const items = await coll.find<Apikey>({}).toArray();
    const maxId = items.reduce((max, x) => {
      const y = (Object.keys(x)[0] || 0) as number;
      return y > max ? y : max;
    }, 0);
    const apiKey: Apikey = {};
    const newId = +maxId + 1;
    apiKey[newId] = key;
    const result = await coll.insertOne(apiKey);
    return result.acknowledged;
  } catch (error) {
    console.error("failed addApikey", error);
    return false;
  }
}
