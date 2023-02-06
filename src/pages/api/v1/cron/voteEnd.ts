import type { NextApiRequest, NextApiResponse } from "next";
import { getData } from "utils/api/cron.helper";
import { insertChartdata } from "utils/database/chartdata.db";
import { findConfigEntry } from "utils/database/config.db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const latest = await findConfigEntry("latest");
  const round = Number(latest) || 0;
  const newRound = await getData(round);
  if (Math.floor(Date.now() / 1000) < newRound.voteEnd) {
    const myvalue = {
      error: "too early, did not write to database",
      value: newRound,
    };
    return res.status(400).json(myvalue);
  }

  const result = await insertChartdata(newRound, round);
  if (!result) res.status(500).send("Error inserting Chartdata");
  return res.status(201).json(result);
}
