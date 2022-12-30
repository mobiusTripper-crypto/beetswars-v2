import { NextApiRequest, NextApiResponse } from "next";
import { Chartdata } from "utils/api/chartdata.model";
import { readApiKeyList } from "utils/database/apikeys.db";
import {
  insertChartdata,
  readOneChartdata,
  removeChartdata,
} from "utils/database/chartdata.db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
      const data = await readOneChartdata(round);
      if (!data) res.status(404).send("No object with given ID found");
      res.json(data);
      break;
    case "POST":
      if (!validApikey) res.status(403).send("not allowed");
      const payload = Chartdata.parse(req.body);
      console.log("here");
      const result = await insertChartdata(payload, round);
      if (!result) res.status(500).send("Error inserting Chartdata");
      res.status(201).json(result);
      break;
    case "DELETE":
      if (!validApikey) res.status(403).send("not allowed");
      const success = await removeChartdata(round);
      if (!success) res.status(500).send("could not delete");
      res.send(`deleted round ${round}`);
      break;
    default:
      res.status(501).send("not implemented");
  }
}
