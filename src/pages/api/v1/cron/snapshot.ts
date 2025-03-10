import type { NextApiRequest, NextApiResponse } from "next";
import { addRoundFromSnapshot, getEmissionNumber } from "utils/api/round.helper";
import { findConfigEntry } from "utils/database/config.db";
import { insertCronLog } from "utils/database/cronLog.db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(501).send("not implemented");
  const data = await addRoundFromSnapshot();
  const round = await findConfigEntry("latest");
  if (round) {
    console.log("Emission: ",await getEmissionNumber(Number(round)));
  }
  if (!data) return res.status(400).send("No new round entry found");
  const dateReadable = new Date(Date.now()).toUTCString();
  await insertCronLog({ timestamp: Math.floor(Date.now() / 1000), jobName: "snapshot", dateReadable });
  res.send(JSON.stringify(data, null, "  "));
}
