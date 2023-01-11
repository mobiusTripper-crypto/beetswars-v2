import { NextApiRequest, NextApiResponse } from "next";
import getBribeData from "utils/api/bribedata.helper";
// import getRoundHeader from "utils/api/roundHeader.helper";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") return res.status(501).send("not implemented");
  const bribedata = await getBribeData();
  const data = bribedata?.header ?? {};
  // const data = await getRoundHeader();
  if (!data) return res.status(404).send("No object with given ID found");
  res.json(data);
}
