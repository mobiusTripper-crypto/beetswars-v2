import { NextApiRequest, NextApiResponse } from "next";
import getBribeData from "utils/api/bribedata.helper";
// import getOverallStats from "utils/api/sumstats.helper";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") return res.status(501).send("not implemented");
  // const data = await getOverallStats();
  const data = await getBribeData(27);
  if (!data) return res.status(404).send("No object with given ID found");
  res.json(data);
}
