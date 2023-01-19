import clientPromise from "./mongodb";

type Login = { key: string };

export async function readLoginList(): Promise<string[]> {
  try {
    const client = await clientPromise;
    const coll = client.db("beetswars").collection<Login>("login");
    const items = await coll.find<Login>({}).toArray(); // find all
    if (!items || items.length === 0) return [];
    const keylist = items.map((item) => item.key);
    return keylist;
  } catch (error) {
    console.error("failed readLoginList", error);
    return [];
  }
}

// will not insert duplicate values
export async function addLogin(key: string): Promise<boolean> {
  try {
    const client = await clientPromise;
    const coll = client.db("beetswars").collection<Login>("login");
    const { value, ok } = await coll.findOneAndReplace(
      { key }, // find
      { key }, // replace with
      { upsert: true, returnDocument: "after" } // add if not found
    );
    return !!ok && !!value;
  } catch (error) {
    console.error("failed addLogin", error);
    return false;
  }
}
