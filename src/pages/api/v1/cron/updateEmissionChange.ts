import type { NextApiRequest, NextApiResponse } from "next";
import { updateEmissionChange } from "utils/database/beetsEmissions.db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const result = await updateEmissionChange();

  if (!result) res.status(500).send("Error updating Emissions");
  return res.status(201).json(result);
}
