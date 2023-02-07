import type { NextApiRequest, NextApiResponse } from "next";
import { readAllChartdata } from "utils/database/chartdata.db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(501).send("not implemented");
  const data = await readAllChartdata();
  const data2 = { database: process.env.DB_NAME, chart: data };
  if (!data2) return res.status(404).send("No object with given ID found");
  res.json(data2);
}
