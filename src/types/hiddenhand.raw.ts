import * as z from "zod";

export const HiddenhandBribe = z.object({
  token: z.string(),
  symbol: z.string(),
  decimals: z.number(),
  value: z.number(),
  maxValue: z.number(),
  amount: z.number(),
  maxTokensPerVote: z.number(),
  briber: z.string(),
  periodIndex: z.number(),
  chainId: z.number(),
});

export type HiddenhandBribe = z.infer<typeof HiddenhandBribe>;

export const HiddenhandEntry = z.object({
  proposal: z.string(),
  proposalHash: z.string(),
  title: z.string(),
  proposalDeadline: z.number(),
  totalValue: z.number(),
  maxTotalValue: z.number(),
  voteCount: z.number(),
  valuePerVote: z.number(),
  maxValuePerVote: z.number(),
  bribes: HiddenhandBribe.array(),
  index: z.string()
});

export type HiddenhandEntry = z.infer<typeof HiddenhandEntry>;
