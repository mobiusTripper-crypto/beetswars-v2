import { NextApiRequest, NextApiResponse } from "next";
import getRoundHeader from "utils/api/roundHeader.helper";

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
  const data = await getRoundHeader(+round);
  if (!data) return res.status(404).send("No object with given ID found");
  res.json(data);
}
