import type { NextApiRequest, NextApiResponse } from "next";
import { Tokendata } from "types/bribedata.raw";
import { readApiKeyList } from "utils/database/apikeys.db";
import { insertBribefile, readOneBribefile } from "utils/database/bribefile.db";
import { ZodError } from "zod";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // get round from path
  const {
    query: { round },
  } = req;
  if (typeof round !== "string") return res.status(422).send("Parameter error");
  // check api-key
  const key = req.headers["x-api-key"];
  const apikey = typeof key === "string" ? key : "";
  const apikeyList = await readApiKeyList();
  const validApikey = apikeyList.includes(apikey);
  // POST only
  if (req.method !== "POST") return res.status(501).send("not implemented");
  if (!validApikey) return res.status(403).send("not allowed");
  let payload: Tokendata;
  try {
    payload = Tokendata.parse(req.body);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(422).send(error);
    }
    return res.status(400).send(error);
  }
  const oldData = await readOneBribefile(+round);
  if (!oldData) return res.status(404).send("No entry found to add data");
  const { tokendata, ...rest } = oldData;
  const newTokendata = tokendata.filter(x => x.token !== payload.token);
  newTokendata.push(payload);
  const newRound = { ...rest, tokendata: newTokendata };
  const result = await insertBribefile(newRound, +round);
  if (!result) return res.status(500).send("Error inserting Bribefile");
  res.status(201).json(result);
}
