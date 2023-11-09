import * as z from "zod";

export const Tokendata = z.object({
  token: z.string(),
  tokenaddress: z.string().nullable().optional(),
  coingeckoid: z.string().nullable().optional(),
  bptpoolid: z.string().nullable().optional(),
  isbpt: z.boolean().nullable().optional(),
  lastprice: z.number().nullable().optional(),
  tokenId: z.number(),
});
export type Tokendata = z.infer<typeof Tokendata>;

export const Reward = z.object({
  type: z.enum(["fixed", "percent", "pervote"]),
  token: z.string(),
  amount: z.number(),
  isfixed: z.boolean(),
  rewardId: z.number(),
  isProtocolBribe: z.boolean(),
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
  assumption: z.string().optional(),
  percentagethreshold: z.number().optional(),
  rewardcap: z.number().optional(),
  additionalrewards: Additionalrewards.array().optional(),
  reward: Reward.array(),
  payoutthreshold: z.number().optional(),
  offerId: z.number(),
});
export type Bribedata = z.infer<typeof Bribedata>;

export const Bribefile = z.object({
  version: z.string(),
  snapshot: z.string(),
  description: z.string(),
  round: z.number(),
  voteStart: z.number().optional(),
  voteEnd: z.number().optional(),
  snapshotDateTime: z.number().optional(),
  tokendata: Tokendata.array(),
  bribedata: Bribedata.array(),
});

export type Bribefile = z.infer<typeof Bribefile>;
