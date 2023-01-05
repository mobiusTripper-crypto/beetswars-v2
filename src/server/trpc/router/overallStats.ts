import getOverallStats from "utils/api/sumstats.helper";
import { router, publicProcedure } from "../trpc";

export const statsRouter = router({
  overallStats: publicProcedure.query(async () => {
    return {
      data: await getOverallStats(),
    };
  }),
});
