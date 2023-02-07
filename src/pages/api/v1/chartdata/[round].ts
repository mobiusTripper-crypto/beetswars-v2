import type { NextApiRequest, NextApiResponse } from "next";
import { Chartdata } from "types/chartdata.raw";
import { readApiKeyList } from "utils/database/apikeys.db";
import { insertChartdata, readOneChartdataV1, removeChartdata } from "utils/database/chartdata.db";
import { ZodError } from "zod";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // get round
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
      const data = await readOneChartdataV1(+round);
      if (!data) {
        res.status(404).send("No object with given ID found");
        break;
      }
      res.json(data);
      break;
    case "POST":
      if (!validApikey) {
        res.status(403).send("not allowed");
        break;
      }
      let payload: Chartdata;
      try {
        payload = Chartdata.parse(req.body);
      } catch (error) {
        if (error instanceof ZodError) {
          return res.status(422).send(error);
        }
        return res.status(400).send(error);
      }
      const result = await insertChartdata(payload, +round);
      if (!result) {
        res.status(500).send("Error inserting Chartdata");
        break;
      }
      res.status(201).json(result);
      break;
    case "DELETE":
      if (!validApikey) {
        res.status(403).send("not allowed");
        break;
      }
      const success = await removeChartdata(+round);
      if (!success) {
        res.status(500).send("could not delete");
        break;
      }
      res.send(`deleted round ${round}`);
      break;
    default:
      res.status(501).send("not implemented");
  }
}
