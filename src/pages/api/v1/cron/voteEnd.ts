import { NextApiRequest, NextApiResponse } from "next";
import { getData } from "utils/api/cron.helper";
import { insertChartdata, readOneChartdata } from "utils/database/chartdata.db";
import { findConfigEntry } from "utils/database/config.db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const round = await findConfigEntry("latest");
  if (!round) return;
  const newRound = await getData(round);
  if (Math.floor(Date.now() / 1000) < newRound.voteEnd) {
    const myvalue = {
      error: "too early, did not write to database",
      value: newRound,
    };
    return res.status(400).json(myvalue);
  }
  // 3 lines disabled to allow multiple entries. handle with care!
  ////////////////////////////////////////////////////////////////
  // const checkChartdataEntry = await readOneChartdata(round);
  // if (checkChartdataEntry)
  //   return res.status(409).send(`duplicate entry round ${round}`);

  const result = await insertChartdata(newRound, round);
  if (!result) res.status(500).send("Error inserting Chartdata");
  return res.status(201).json(result);
}
