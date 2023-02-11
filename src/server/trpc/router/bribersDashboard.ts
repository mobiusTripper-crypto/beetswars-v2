import { router, publicProcedure } from "../trpc";
import * as z from "zod";
// import { TRPCError } from "@trpc/server";
// import type { Session } from "next-auth";
import { bribesRoi, dashData } from "utils/api/bribersDashboard.helper";

export const dashboardRouter = router({
  list: publicProcedure.input(z.object({ round: z.number() })).query(async ({ input }) => {
    const board = await dashData(input.round);
    return { board: board };
  }),
  single: publicProcedure
    .input(z.object({ round: z.number(), voteindex: z.number() }))
    .query(async ({ input }) => {
      const board = await bribesRoi(input.round, input.voteindex);
      return { board: board };
    }),
});
