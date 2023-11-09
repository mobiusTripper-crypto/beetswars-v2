import * as z from "zod";

export const ChartdataV1 = z.object({
  round: z.string(),
  voteEnd: z.number(),
  totalVotes: z.number(),
  bribedVotes: z.number(),
  externallyBribedVotes: z.number(),
  totalBribes: z.number(),
  totalExternalBribes: z.number(),
  totalVoter: z.number(),
  totalBriber: z.number(),
  priceBeets: z.number(),
  priceFbeets: z.number(),
  bribersRoi: z.number().optional(),
});

export type ChartdataV1 = z.infer<typeof ChartdataV1>;

export const Chartdata = z.object({
  round: z.number(),
  voteEnd: z.number(),
  totalVotes: z.number(),
  bribedVotes: z.number(),
  externallyBribedVotes: z.number(),
  totalBribes: z.number(),
  totalExternalBribes: z.number(),
  totalVoter: z.number(),
  totalBriber: z.number(),
  priceBeets: z.number(),
  priceFbeets: z.number(),
  pricePerVp: z.number().optional(),
  bribersRoi: z.number().optional(),
});

export type Chartdata = z.infer<typeof Chartdata>;
