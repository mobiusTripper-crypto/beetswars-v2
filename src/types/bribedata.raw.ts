import * as z from "zod";

export const Tokendata = z.object({
  token: z.string(),
  tokenaddress: z.string().nullable().optional(),
  coingeckoid: z.string().nullable().optional(),
  bptpoolid: z.string().nullable().optional(),
  isbpt: z.boolean().nullable().optional(),
  lastprice: z.number().nullable().optional(),
  tokenId: z.number(),
  cacheprice: z.number().nullable().optional(),
  cachetimestamp: z.number().nullable().optional(),
});
export type Tokendata = z.infer<typeof Tokendata>;

export const Reward = z.object({
  type: z.enum(["fixed", "percent", "pervote"]),
  token: z.string(),
  amount: z.number(),
  isfixed: z.boolean(),
  rewardId: z.number(),
  isProtocolBribe: z.boolean().default(false),
});
export type Reward = z.infer<typeof Reward>;

export const Additionalrewards = z.object({
  tier: z.string(),
  factor: z.number(),
});
export type Additionalrewards = z.infer<typeof Additionalrewards>;

export const Bribedata = z.object({
  voteindex: z.number(),
  poolname: z.string(),
  poolurl: z.string(),
  rewarddescription: z.string(),
  assumption: z.string().nullable().optional(),
  percentagethreshold: z.number().nullable().optional(),
  rewardcap: z.number().nullable().optional(),
  additionalrewards: Additionalrewards.array().nullable().optional(),
  reward: Reward.array(),
  payoutthreshold: z.number().nullable().optional(),
  offerId: z.number(),
});
export type Bribedata = z.infer<typeof Bribedata>;

export const Bribefile = z.object({
  version: z.string(),
  snapshot: z.string(),
  description: z.string(),
  round: z.number(),
  emission: z.number().optional(),
  voteStart: z.number().optional(),
  voteEnd: z.number().optional(),
  snapshotDateTime: z.number().optional(),
  tokendata: Tokendata.array(),
  bribedata: Bribedata.array(),
});

export type Bribefile = z.infer<typeof Bribefile>;
