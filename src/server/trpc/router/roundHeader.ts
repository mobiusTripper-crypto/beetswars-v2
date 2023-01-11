// import getRoundHeader from "utils/api/roundHeader.helper";
import getBribeData from "utils/api/bribedata.helper";
import { router, publicProcedure } from "../trpc";

export const headerRouter = router({
  header: publicProcedure.query(async () => {
    const bribedata = await getBribeData();
    return {
      // data: await getRoundHeader(),
      data: bribedata?.header || {},
    };
  }),
});
