import type { NextApiRequest, NextApiResponse } from "next";
import { readOneBribefile } from "utils/database/bribefile.db";
import { findConfigEntry } from "utils/database/config.db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(501).send("not implemented");
  const round = await findConfigEntry("latest");
  if (!round) return res.status(400).send("no data found");
  const data = await readOneBribefile(+round);
  if (!data) return res.status(404).send("No object with given ID found");
  res.json(data);
}
