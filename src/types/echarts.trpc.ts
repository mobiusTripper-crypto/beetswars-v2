import * as z from "zod";

export const Echarts = z.object({
  rounds: z.string().array(),
  bribedVotes: z.number().array(),
  bribedVotesRatio: z.number().array(),
  totalVotes: z.number().array(),
  totalVoter: z.number().array(),
  totalBribes: z.array(z.number().or(z.string())),
  totalOffers: z.number().array(),
  avgPer1000: z.number().array(),
  priceBeets: z.number().array(),
  endTime: z.string().array(),
  votingApr: z.number().array(),
});

export type Echarts = z.infer<typeof Echarts>;
