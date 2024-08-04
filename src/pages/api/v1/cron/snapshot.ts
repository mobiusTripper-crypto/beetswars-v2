import type { NextApiRequest, NextApiResponse } from "next";
import { addRoundFromSnapshot } from "utils/api/round.helper";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(501).send("not implemented");
  const data = await addRoundFromSnapshot();
  if (!data) return res.status(400).send("No new round entry found");
  res.send(JSON.stringify(data, null, "  "));
}
