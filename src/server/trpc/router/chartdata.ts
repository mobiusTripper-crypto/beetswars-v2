import getEchartData from "utils/api/chartdata.helper";
import getChartdata from "utils/api/chartdata.helper";

import { router, publicProcedure } from "../trpc";

export const chartdataRouter = router({
  chartdata: publicProcedure.query(async () => {
    return {
      chartdata: await getEchartData(),
    };
  }),
});
