import { router, publicProcedure } from "../trpc";
import * as z from "zod";
// import { TRPCError } from "@trpc/server";
// import type { Session } from "next-auth";
import { dashData } from "utils/api/bribersDashboard.helper";

export const dashboardRouter = router({
  list: publicProcedure
    .input(z.object({ round: z.number().nullish() }).nullish())
    .query(async ({ input }) => {
      return { board: await dashData(input?.round ?? 0) };
    }),
});
