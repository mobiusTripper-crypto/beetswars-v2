import { router } from "../trpc";
import { chartdataRouter } from "./chartdata";
import { exampleRouter } from "./example";
import { loginRouter } from "./loginId";
import { statsRouter } from "./overallStats";
import { roundlistRouter } from "./roundlist";

export const appRouter = router({
  example: exampleRouter,
  chart: chartdataRouter,
  rounds: roundlistRouter,
  stats: statsRouter,
  login: loginRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
