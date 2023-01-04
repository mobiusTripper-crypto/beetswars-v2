import * as z from "zod";

export const Roundlist = z.object({
  rounds: z.string().array(),
  latest: z.number(),
});

export type Roundlist = z.infer<typeof Roundlist>;
