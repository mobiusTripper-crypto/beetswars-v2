// find all
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const key = req.headers;
  // console.log(key);
  res.status(200).send("chart");
}
