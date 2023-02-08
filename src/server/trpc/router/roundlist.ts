import { getRoundlistNum } from "utils/api/roundlist.helper";
import { findConfigEntry } from "utils/database/config.db";
import { router, publicProcedure } from "../trpc";

export const roundlistRouter = router({
  list: publicProcedure.query(async () => {
    return { data: await getRoundlistNum() };
  }),
  latest: publicProcedure.query(async () => {
  const round = await findConfigEntry("latest");
    return Number(round || 0)
  })
});
