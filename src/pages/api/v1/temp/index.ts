import type { NextApiRequest, NextApiResponse } from "next";
import { readEmissionList } from "utils/database/beetsEmissions.db";
import { getSnapshotVotesPerPool } from "utils/externalData/snapshot";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(501).send("not implemented");
  // const data = await readEmissionList();
  const data = await getSnapshotVotesPerPool(
    "0xae9c3b86ea25fe5635b0ba6de94985fa946d87631c2ac24fc4309923750c05ef"
  );
  if (!data) return res.status(404).send("No object with given ID found");
  res.json(data);
}
