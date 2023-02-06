import type { NextApiRequest, NextApiResponse } from "next";
import { getEmissionForRound } from "utils/api/bribeApr.helper";
import { findConfigEntry } from "utils/database/config.db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(501).send("not implemented");
  // get round
  const {
    query: { round },
  } = req;
  let roundNum = typeof round === "string" ? +round : 0;
  if (!roundNum) {
    const latest = await findConfigEntry("latest");
    roundNum = !latest ? 99 : +latest + 1;
  }
  // const roundStr = roundNum.toString().padStart(2, "0");
  // get data
  const data = await getEmissionForRound(roundNum);
  if (!data) return res.status(404).send("No object with given ID found");
  res.json(data);
}
