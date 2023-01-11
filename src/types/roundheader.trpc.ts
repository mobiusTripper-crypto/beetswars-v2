import * as z from "zod";

export const Roundheader = z.object({
  roundName: z.string(),
  voteStart: z.string(),
  voteEnd: z.string(),
  timeRemaining: z.string(),
  totalVotes: z.number(),
  bribedVotes: z.number(),
  totalVoter: z.number(),
  bribedVoter: z.number(),
  totalBribes: z.number(),
  avgPer1000: z.number(),
});

export type Roundheader = z.infer<typeof Roundheader>;
