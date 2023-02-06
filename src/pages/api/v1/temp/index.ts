import type { NextApiRequest, NextApiResponse } from "next";
import { insertChartdata, readAllChartdata, removeChartdata } from "utils/database/chartdata.db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(501).send("not implemented");
  // const data = await
  const chartdata = await readAllChartdata();
  console.log(chartdata?.length);
  let newcd;
  if (!!chartdata) {
    newcd = chartdata.map(async item => {
      const round = Number(item.round);
      const payload = { ...item, round };
      await removeChartdata(round);
      const result = await insertChartdata(payload, round);
      console.log(result?.round);
      return result;
    });
  }
  const data = { database: process.env.DB_NAME, chart: newcd };
  if (!data) return res.status(404).send("No object with given ID found");
  res.json(data);
}
