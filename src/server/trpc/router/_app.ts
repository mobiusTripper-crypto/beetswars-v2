import { router } from "../trpc";
import { chartdataRouter } from "./chartdata";
import { exampleRouter } from "./example";
import { roundlistRouter } from "./roundlist";

export const appRouter = router({
  example: exampleRouter,
  chart: chartdataRouter,
  rounds: roundlistRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
