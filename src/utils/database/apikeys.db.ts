import clientPromise from "./mongodb";

type WithId<T> = T & { _id: string };
type Apikey = {
  [key: number]: string;
};

export async function read(): Promise<string[]> {
  const client = await clientPromise;
  const coll = client.db("beetswars").collection<Apikey>("apikeys");
  const items = (await coll.find<Apikey>({}).toArray()) as WithId<Apikey>[];
  if (!items || items.length === 0) return [];
  const keylist = items.map((item) => Object.values(item)[0]) as string[];
  return keylist;
}
