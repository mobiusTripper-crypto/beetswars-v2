import * as z from "zod";
import { Bribedata } from "./bribedata.raw";

export const Suggestion = z.object({
  round: z.number(),
  poolName: z.string(),
  voteIndex: z.number(),
  previousData: Bribedata.optional(),
});

export type Suggestion = z.infer<typeof Suggestion>;
