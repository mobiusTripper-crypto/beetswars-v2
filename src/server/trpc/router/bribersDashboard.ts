import { router, publicProcedure } from "../trpc";
import * as z from "zod";
// import { TRPCError } from "@trpc/server";
// import type { Session } from "next-auth";
import { commonDashData, poolDashData, roundlist } from "utils/api/bribersDashboard.helper";
// import { bribesRoi, dashData, roundlist } from "utils/api/bribersDashboard.helper";
import { readRoundPoolentries } from "utils/database/votablePools.db";

export const dashboardRouter = router({
  list: publicProcedure.input(z.object({ round: z.number() })).query(async ({ input }) => {
    const board = await commonDashData(input.round);
    return { board: board };
  }),
  single: publicProcedure
    .input(z.object({ round: z.number(), voteindex: z.number() }))
    .query(async ({ input }) => {
      const board = await poolDashData(input.round, input.voteindex);
      return { board: board };
    }),
  // list: publicProcedure.input(z.object({ round: z.number() })).query(async ({ input }) => {
  //   const board = await dashData(input.round);
  //   return { board: board };
  // }),
  // single: publicProcedure
  //   .input(z.object({ round: z.number(), voteindex: z.number() }))
  //   .query(async ({ input }) => {
  //     const board = await bribesRoi(input.round, input.voteindex);
  //     return { board: board };
  //   }),
  roundlist: publicProcedure.query(async () => await roundlist()),
  poolslist: publicProcedure.input(z.object({ round: z.number() })).query(async ({ input }) => {
    const pools = await readRoundPoolentries(input.round);
    return { pools: pools };
  }),
});
