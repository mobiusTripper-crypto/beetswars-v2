import { getRoundlistNum } from "utils/api/roundlist.helper";
// import getRoundlist, { getRoundlistNum } from "utils/api/roundlist.helper";
import { router, publicProcedure } from "../trpc";

export const roundlistRouter = router({
  // roundlist: publicProcedure.query(async () => {
  //   return { data: await getRoundlist() };
  // }),
  list: publicProcedure.query(async () => {
    return { data: await getRoundlistNum() };
  }),
});
