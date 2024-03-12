import type { NextApiRequest, NextApiResponse } from "next";
import processHiddenhandApi from "utils/api/hiddenhand.helper";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(501).send("not implemented");
  const data = await processHiddenhandApi();
  if (!data) return res.status(404).send("No object with given ID found");
  res.send(JSON.stringify(data, null, "  "));
  // res.json(data);
}
