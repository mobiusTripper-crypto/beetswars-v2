import { NextApiRequest, NextApiResponse } from "next";
import getBribeData from "utils/api/bribedata.helper";
// import getRoundHeader from "utils/api/roundHeader.helper";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") return res.status(501).send("not implemented");
  // get round from path
  const {
    query: { round },
  } = req;
  if (typeof round !== "string") return res.status(422).send("Parameter error");
  // get data
  // const data = await getRoundHeader(+round);
  const bribedata = await getBribeData(+round);
  const data = bribedata?.header ?? {};
  if (!data) return res.status(404).send("No object with given ID found");
  res.json(data);
}
