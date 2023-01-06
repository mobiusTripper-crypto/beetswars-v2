//import { addLogin, readLoginList } from "utils/database/loginID.db";
import { readOneBribefile } from "utils/database/bribefile.db";
import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const bribesRouter = router({
  list: publicProcedure.query(async () => {
    return {
      bribeList: await readOneBribefile(27),
    };
  }),
});
