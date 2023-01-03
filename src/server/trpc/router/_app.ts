import { router } from "../trpc";
import { chartdataRouter } from "./chartdata";
import { exampleRouter } from "./example";

export const appRouter = router({
  example: exampleRouter,
  chart: chartdataRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
