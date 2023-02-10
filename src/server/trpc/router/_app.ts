import { router } from "../trpc";
import { bribedataRouter } from "./bribedata";
import { dashboardRouter } from "./bribersDashboard";
import { bribesRouter } from "./bribes";
import { chartdataRouter } from "./chartdata";
import { exampleRouter } from "./example";
import { loginRouter } from "./loginId";
import { statsRouter } from "./overallStats";
import { roundlistRouter } from "./roundlist";
import { votepoolsRouter } from "./votepools";

export const appRouter = router({
  example: exampleRouter,
  chart: chartdataRouter,
  rounds: roundlistRouter,
  stats: statsRouter,
  login: loginRouter,
  bribes_test: bribesRouter,
  bribes: bribedataRouter,
  votepools: votepoolsRouter,
  dashboard: dashboardRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
