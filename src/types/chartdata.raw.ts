import * as z from "zod";

export const Chartdata = z.object({
  round: z.string(),
  voteEnd: z.number(),
  totalVotes: z.number(),
  bribedVotes: z.number(),
  totalBribes: z.number(),
  totalVoter: z.number(),
  totalBriber: z.number(),
  priceBeets: z.number(),
  priceFbeets: z.number(),
  bribersRoi: z.number().optional(),
});

export type Chartdata = z.infer<typeof Chartdata>;

export const Chartdata2 = z.object({
  round: z.string().or(z.number()),
  voteEnd: z.number(),
  totalVotes: z.number(),
  bribedVotes: z.number(),
  totalBribes: z.number(),
  totalVoter: z.number(),
  totalBriber: z.number(),
  priceBeets: z.number(),
  priceFbeets: z.number(),
  bribersRoi: z.number().optional(),
});

export type Chartdata2 = z.infer<typeof Chartdata2>;
