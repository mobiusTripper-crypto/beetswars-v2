import { NextApiRequest, NextApiResponse } from "next";
import { getEmissionForRound } from "utils/api/bribeApr.helper";
import { findConfigEntry } from "utils/database/config.db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") return res.status(501).send("not implemented");
  // get Data
  const latest = await findConfigEntry("latest");
  const roundNum = !latest ? 99 : +latest + 1;
  const roundStr = roundNum.toString().padStart(2, "0");

  const data = await getEmissionForRound(roundStr); // any high number
  console.log(data);
  if (!data) return res.status(404).send("No object with given ID found");
  res.json(data);
}
