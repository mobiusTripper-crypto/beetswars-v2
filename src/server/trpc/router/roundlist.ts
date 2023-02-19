import { getRoundlistNum } from "utils/api/roundlist.helper";
import { findConfigEntry, setConfigEntry } from "utils/database/config.db";
import { router, publicProcedure } from "../trpc";
import * as z from "zod";
import type { Session } from "next-auth";
import { TRPCError } from "@trpc/server";
import type { Config } from "types/config.raw";

export const roundlistRouter = router({
  list: publicProcedure.query(async () => {
    return { data: await getRoundlistNum() };
  }),
  latest: publicProcedure.query(async () => {
    const round = await findConfigEntry("latest");
    return Number(round || 0);
  }),
  setLatest: publicProcedure
    .input(z.object({ latest: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const session = ctx as Session;
      if (!session.user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      const entry: Config = { name: "latest", data: Number(input.latest) };
      const result = await setConfigEntry(entry);
      return result;
    }),
});
