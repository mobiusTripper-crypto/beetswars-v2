import * as z from "zod";

export const CardData = z.object({
  heading: z.string(),
  headUrl: z.string().optional(),
  text: z.string(),
  subtext: z.string().optional(),
  data: z
    .array(
      z.object({
        key: z.string(),
        value: z.string(),
      })
    )
    .optional(),
  footer: z.string(),
});

export type CardData = z.infer<typeof CardData>;
