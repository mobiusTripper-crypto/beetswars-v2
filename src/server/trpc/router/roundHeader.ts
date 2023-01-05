import getRoundHeader from "utils/api/roundHeader.helper";
import { router, publicProcedure } from "../trpc";

export const headerRouter = router({
  header: publicProcedure.query(async () => {
    return {
      data: await getRoundHeader(),
    };
  }),
});
