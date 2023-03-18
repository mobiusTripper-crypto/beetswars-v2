import * as z from "zod";

export const Address = z.string().regex(/^0x[0-9a-fA-F]{40}$/);

export type Address = z.infer<typeof Address>;

export const Blocks = z.object({
  blocks: z
    .object({
      timestamp: z.string(),
      number: z.string(),
    })
    .array(),
});

export type Blocks = z.infer<typeof Blocks>;

export const RelicBalance = z.object({
  address: Address,
  relics: z
    .object({
      relicId: z.number(),
      balance: z.string(),
    })
    .array(),
});

export type RelicBalance = z.infer<typeof RelicBalance>;

export const RelicCount = z.object({
  reliquaries: z
    .object({
      relicCount: z.number(),
      id: Address,
      pools: z
        .object({
          pid: z.number(),
          relicCount: z.number(),
        })
        .array(),
    })
    .array(),
});

export type RelicCount = z.infer<typeof RelicCount>;

export const RelicPoolLevels = z.object({
  poolLevels: z
    .object({
      allocationPoints: z.number(),
      balance: z.number(),
      level: z.number(),
      pool: z.object({
        pid: z.number(),
        relicCount: z.number(),
        totalBalance: z.number(),
      }),
    })
    .array(),
});

export type RelicPoolLevels = z.infer<typeof RelicPoolLevels>;
