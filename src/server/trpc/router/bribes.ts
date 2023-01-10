//import { addLogin, readLoginList } from "utils/database/loginID.db";
import { TRPCError } from "@trpc/server";
import { type Session } from "next-auth";
import { readOneBribefile } from "utils/database/bribefile.db";

import { router, publicProcedure } from "../trpc";

export const bribesRouter = router({
  list: publicProcedure.query(async ({ ctx }) => {
    // we do not want this protected, but checking for authenticated user as a test to make sure this works
    //remove session.user check after verify testing this pattern works
    console.log("ctx1", ctx);
    const session = ctx as Session;
    if (!session?.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return {
      bribeList: await readOneBribefile(27),
    };
  }),
});
