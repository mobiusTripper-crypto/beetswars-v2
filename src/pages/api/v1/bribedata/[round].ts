import type { NextApiRequest, NextApiResponse } from "next";
import { Bribefile } from "types/bribedata.raw";
import { readApiKeyList } from "utils/database/apikeys.db";
import { insertBribefile, readOneBribefile, removeBribefile } from "utils/database/bribefile.db";
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
  // handle different methods
  switch (req.method) {
    case "GET":
      const data = await readOneBribefile(+round);
      if (!data) return res.status(404).send("No object with given ID found");
      res.json(data);
      break;
    case "POST":
      if (!validApikey) return res.status(403).send("not allowed");
      let payload: Bribefile;
      try {
        payload = Bribefile.parse(req.body);
      } catch (error) {
        if (error instanceof ZodError) {
          return res.status(422).send(error);
        }
        return res.status(400).send(error);
      }
      const result = await insertBribefile(payload, +round);
      if (!result) return res.status(500).send("Error inserting Bribefile");
      res.status(201).json(result);
      break;
    case "DELETE":
      if (!validApikey) return res.status(403).send("not allowed");
      const success = await removeBribefile(+round);
      if (!success) return res.status(500).send("could not delete");
      res.send("Bribefile deleted successfully");
      break;
    default:
      res.status(501).send("not implemented");
  }
}
