import * as z from "zod";

// export const Roundlist = z.object({
//   rounds: z.string().array(),
//   latest: z.string(),
// });

// export type Roundlist = z.infer<typeof Roundlist>;

export const RoundlistNum = z.object({
  rounds: z.number().array(),
  latest: z.number(),
});

export type RoundlistNum = z.infer<typeof RoundlistNum>;
