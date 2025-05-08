import * as z from "zod";

export const Gauge = z.object({
  poolName: z.string(),
  poolId: z.string(),
  weeklyBeetsAmountFromGauge: z.union([z.number(), z.string()]),
  weeklyBeetsAmountFromMD: z.union([z.number(), z.string()]),
  weeklyStSRewards: z.union([z.number(), z.string()]),
  weeklyStSRewardsFromSeasons: z.union([z.number(), z.string()]),
  weeklyFragmentsRewards: z.union([z.number(), z.string()]),
});

export type Gauge = z.infer<typeof Gauge>;

export const Automation = z.object({
  beetsToDistribute: z.union([z.number(), z.string()]).nullable(), // number or string, may be null or undefined
  startTimestamp: z.number(),
  endTimestamp: z.number(),
  snapshotBlock: z.number(),
  gauges: z.array(Gauge),
});

export type Automation = z.infer<typeof Automation>;
