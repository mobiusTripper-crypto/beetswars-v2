import type { NextApiRequest, NextApiResponse } from "next";
// import { getHiddenhandBribes } from "utils/externalData/hiddenhand";
import { readEmissionList } from "utils/database/beetsEmissions.db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(501).send("not implemented");
  const data = await readEmissionList();
  // const data = await getHiddenhandBribes();
  if (!data) return res.status(404).send("No object with given ID found");
  res.send(JSON.stringify(data, null, "  "));
}
