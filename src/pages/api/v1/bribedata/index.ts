import { NextApiRequest, NextApiResponse } from "next";
import { readAllBribefile } from "utils/database/bribefile.db";

const baseurl = "https://v2.beetswars.live/api/v1/bribedata/";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") return res.status(501).send("not implemented");
  const fullData = await readAllBribefile();
  if (!fullData) return res.status(400).send("No objects found");
  const keylist = fullData.map((x) => {
    const y = x.round.toString();
    return y.length < 2 ? "0" + y : y;
  });
  const result = keylist.map((item) => ({
    key: item,
    url: `${baseurl}${item}`,
  }));
  res.json(result);
}
