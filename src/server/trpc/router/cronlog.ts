import { readAllCronLogs } from "utils/database/cronLog.db";
import { router, publicProcedure } from "../trpc";

export const cronlogRouter = router({
  list: publicProcedure.query(async () => {
    return {
      entries: await readAllCronLogs(),
    };
  }),
});
