import * as z from "zod";

export const Emission = z.object({
  block: z.number(),
  beets: z.number(),
  timestamp: z.number(),
});

export type Emission = z.infer<typeof Emission>;

export const EmissionData = z.object({
  round: z.number(),
  emission: z.number(),
  beetsPrice: z.number(),
  usdValue: z.number(),
  voteEmission: z.number(),
  percentUsdValue: z.number(),
  totalBribes: z.number(),
  totalExternalBribes: z.number().optional(),
  avgBribeRoiInPercent: z.number(),
  avgExternalBribeRoiInPercent: z.number().optional(),
  payoutStatus: z.enum(["estimated", "payout active", "settled"]),
});

export type EmissionData = z.infer<typeof EmissionData>;
