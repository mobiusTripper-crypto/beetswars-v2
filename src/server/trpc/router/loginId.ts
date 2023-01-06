import { addLogin, readLoginList } from "utils/database/loginID.db";
import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const loginRouter = router({
  list: publicProcedure.query(async () => {
    return {
      userlist: await readLoginList(),
    };
  }),
  addUser: publicProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ input }) => {
      const result = await addLogin(input.key);
      return result;
    }),
});
