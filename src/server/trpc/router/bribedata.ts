import { z } from "zod";
import getBribeData from "utils/api/bribedata.helper";
import { router, publicProcedure } from "../trpc";
import { readOneBribefile } from "utils/database/bribefile.db";

// This tRPC endpoint gives back bribedata for one round in 2 possible formats:
// - bribedata: All values are calculated and ready for display
// - bribedata_raw: pure JSON format, as saved in database

export const bribedataRouter = router({
  bribedata: publicProcedure
    .input(z.object({ round: z.number().nullish() }).nullish())
    .query(async ({ input }) => {
      return {
        bribefile: await getBribeData(input?.round ?? undefined),
      };
    }),
  bribedata_raw: publicProcedure
    .input(z.object({ round: z.number().nullish() }).nullish())
    .query(async ({ input }) => {
      return {
        bribefile: await readOneBribefile(input?.round ?? 0),
      };
    }),
});
