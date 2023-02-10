import { router, publicProcedure } from "../trpc";
import * as z from "zod";
import { insertPoolentries, readRoundPoolentries } from "utils/database/votablePools.db";
import { TRPCError } from "@trpc/server";
import type { Session } from "next-auth";
import { VotablePool } from "types/votablePools.raw";
import { initialInsertFromSnapshot } from "utils/api/votablePools.helper";

export const votepoolsRouter = router({
  list: publicProcedure.input(z.object({ round: z.number() })).query(async ({ input }) => {
    return { pools: await readRoundPoolentries(input?.round ?? 0) };
  }),
  insert: publicProcedure.input(VotablePool.array()).mutation(async ({ input, ctx }) => {
    const session = ctx as Session;
    if (!session.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    const result = await insertPoolentries(input);
    return result;
  }),
  init: publicProcedure.input(z.number()).mutation(async ({ input, ctx }) => {
    const session = ctx as Session;
    if (!session.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    const result = await initialInsertFromSnapshot(input);
    return result;
  }),
});
