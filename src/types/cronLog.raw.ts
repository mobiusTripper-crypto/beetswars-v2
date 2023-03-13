import * as z from "zod";

export const CronLog = z.object({
  jobName: z.string(),
  timestamp: z.number(),
  dateReadable: z.string(),
});

export type CronLog = z.infer<typeof CronLog>;
