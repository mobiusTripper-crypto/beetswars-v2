import { z } from "zod";

import getBribeData from "utils/api/bribedata.helper";
import { router, publicProcedure } from "../trpc";

export const bribedataRouter = router({
  bribedata: publicProcedure
    .input(z.object({ round: z.number().nullish() }).nullish())
    .query(async ({ input }) => {
      return {
        bribefile: await getBribeData(input?.round ?? undefined),
      };
    }),
});
