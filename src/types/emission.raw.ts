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
  avgBribeRoiInPercent: z.number(),
  payoutStatus: z.enum(["estimated", "payout active", "settled"]),
});

export type EmissionData = z.infer<typeof EmissionData>;
