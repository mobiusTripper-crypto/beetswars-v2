import type { NextApiRequest, NextApiResponse } from "next";
import { getEmissionNumber } from "utils/api/round.helper";
// import { getHiddenhandBribes } from "utils/externalData/hiddenhand";
// import { readEmissionList } from "utils/database/beetsEmissions.db";
import { findConfigEntry } from "utils/database/config.db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(501).send("not implemented");
  // const data = await readEmissionList();
  // const data = await getHiddenhandBribes();
  const round = await findConfigEntry("latest");
  if (!round) {
    return res.status(500).send("data retrieval failed");
  }
  const data = await getEmissionNumber(Number(round));
  if (!data) return res.status(404).send("No object with given ID found");
  res.send(JSON.stringify(data, null, "  "));
}
