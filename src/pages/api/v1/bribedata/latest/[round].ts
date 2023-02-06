import type { NextApiRequest, NextApiResponse } from "next";
import type { Config } from "types/config.raw";
import { setConfigEntry } from "utils/database/config.db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(501).send("not implemented");
  // get round from path
  const {
    query: { round },
  } = req;
  if (typeof round !== "string") return res.status(422).send("Parameter error");
  // write to db
  const entry: Config = { name: "latest", data: Number(round) };
  const result = await setConfigEntry(entry);
  if (!result) return res.status(500).send("could not write to database");
  res.status(201).send("key set successfully");
}
