import type { NextApiRequest, NextApiResponse } from "next";
import { readAllChartdataV1 } from "utils/database/chartdata.db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(501).send("not implemented");
  const data = await readAllChartdataV1();
  if (!data) return res.status(400).send("no data found");
  res.status(200).json({ chartdata: data });
}
