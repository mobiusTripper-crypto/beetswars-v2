import getRoundlist from "utils/api/roundlist.helper";
import { router, publicProcedure } from "../trpc";

export const roundlistRouter = router({
  roundlist: publicProcedure.query(async () => {
    return {
      data: await getRoundlist(),
    };
  }),
});
