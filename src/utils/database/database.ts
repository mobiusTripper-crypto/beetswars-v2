import clientPromise from "./mongodb";

const dbProvider = {
  async readOne<T extends Document>(
    collection: string,
    key: string
  ): Promise<T | null> {
    const client = await clientPromise;
    const coll = client.db("beetswars").collection<T>(collection);
    const item = await coll.findOne<T>({ key: "1" });
    if (!item) return null;
    console.log(item);
    return null;
  },

  async readAll<T extends Document>(collection: string): Promise<T[] | null> {
    const client = await clientPromise;
    const coll = client.db("beetswars").collection<T>(collection);
    const items = await coll.find<T>({ key: "1" }).toArray();
    return null;
  },

  async readKeyList(collection: string): Promise<string[]> {
    return [];
  },

  async insert<T>(
    collection: string,
    dbkey: string,
    payload: T
  ): Promise<T | null> {
    return null;
  },

  async remove<T>(collection: string, key: string): Promise<boolean> {
    return false;
  },
};

export default dbProvider;
