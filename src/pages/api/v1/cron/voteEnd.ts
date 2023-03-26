import type { NextApiRequest, NextApiResponse } from "next";
import { getData } from "utils/api/cron.helper";
import { insertChartdata } from "utils/database/chartdata.db";
import { findConfigEntry } from "utils/database/config.db";
import { insertCronLog } from "utils/database/cronLog.db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const latest = await findConfigEntry("latest");
  const round = Number(latest) || 0;
  const newRound = await getData(round);
  const now = Math.floor(Date.now() / 1000);
  if (now < newRound.voteEnd || now > newRound.voteEnd + 7 * 24 * 60 * 60) {
    const myvalue = {
      error: "too early, did not write to database",
      value: newRound,
    };
    return res.status(400).json(myvalue);
  }

  const result = await insertChartdata(newRound, round);
  if (!result) res.status(500).send("Error inserting Chartdata");
  const dateReadable = new Date(now * 1000).toUTCString();
  await insertCronLog({ timestamp: now, jobName: "voteEnd", dateReadable });
  return res.status(201).json(result);
}
