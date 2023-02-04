import { TRPCError } from "@trpc/server";
import { type Session } from "next-auth";
import { addApikey } from "utils/database/apikeys.db";
import { addLogin } from "utils/database/loginID.db";
import { z } from "zod";
import { router, publicProcedure } from "../trpc";

export const loginRouter = router({
  addUser: publicProcedure.input(z.object({ key: z.string() })).mutation(async ({ input, ctx }) => {
    const session = ctx as Session;
    if (!session.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    const result = await addLogin(input.key);
    return result;
  }),
  addApikey: publicProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const session = ctx as Session;
      if (!session.user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      const result = await addApikey(input.key);
      return result;
    }),
});
