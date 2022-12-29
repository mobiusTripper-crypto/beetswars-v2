import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const key = req.headers["x-api-key"];
  const apikey = typeof key === "string" ? key : "";
  console.log(apikey);
  res.status(200).send("OK");
}
