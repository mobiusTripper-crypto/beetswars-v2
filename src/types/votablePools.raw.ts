import * as z from "zod";

export const VotablePool = z.object({
  poolName: z.string(),
  voteindex: z.number(),
  round: z.number(),
  isUncapped: z.boolean(),
});

export type VotablePool = z.infer<typeof VotablePool>;
