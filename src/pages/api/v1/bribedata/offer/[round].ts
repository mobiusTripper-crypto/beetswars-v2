import { NextApiRequest, NextApiResponse } from "next";
import { Bribedata } from "utils/api/bribedata.model";
import { readApiKeyList } from "utils/database/apikeys.db";
import { readOneBribefile, insertBribefile } from "utils/database/bribefile.db";
import { ZodError } from "zod";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
  let payload: Bribedata;
  try {
    payload = Bribedata.parse(req.body);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(422).send(error);
    }
    return res.status(400).send(error);
  }
  const oldData = await readOneBribefile(+round);
  if (!oldData) return res.status(400).send("No entry found to add data");
  const { bribedata, ...rest } = oldData;
  const newBribedata = bribedata.filter(
    (x) => x.voteindex !== payload.voteindex
  );
  newBribedata.push(payload);
  const newRound = { ...rest, bribedata: newBribedata };
  const result = await insertBribefile(newRound, +round);
  if (!result) return res.status(500).send("Error inserting Bribefile");
  res.status(201).json(result);
}
