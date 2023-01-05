import { router } from "../trpc";
import { chartdataRouter } from "./chartdata";
import { exampleRouter } from "./example";
import { statsRouter } from "./overallStats";
import { headerRouter } from "./roundHeader";
import { roundlistRouter } from "./roundlist";

export const appRouter = router({
  example: exampleRouter,
  chart: chartdataRouter,
  rounds: roundlistRouter,
  stats: statsRouter,
  header: headerRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
