import * as z from "zod";

export const Emission = z.object({
  block: z.number(),
  beets: z.number(),
  timestamp: z.number(),
});

export type Emission = z.infer<typeof Emission>;
