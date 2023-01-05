import * as z from "zod";

export const OverallStats = z.object({
  rounds: z.number(),
  bribedVotes: z.number(),
  bribedVotesRatio: z.number(),
  totalVotes: z.number(),
  totalVoter: z.number(),
  totalBribes: z.number(),
  totalOffers: z.number(),
  avgPer1000: z.number(),
  avgPriceBeets: z.number(),
  avgVotingApr: z.string(),
});

export type OverallStats = z.infer<typeof OverallStats>;
