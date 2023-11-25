import * as z from "zod";

export const VotablePool = z.object({
  poolName: z.string(),
  voteindex: z.number(),
  round: z.number(),
  isUncapped: z.boolean(),
  capMultiplier: z.number().optional(),
});

export type VotablePool = z.infer<typeof VotablePool>;
