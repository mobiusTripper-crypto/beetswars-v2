import * as z from "zod";

export const Chart = z.object({
  round: z.string(),
  bribedVotes: z.number(),
  bribedVotesRatio: z.number(),
  totalVotes: z.number(),
  totalVoter: z.number(),
  totalBribes: z.number().nullable(),
  totalOffers: z.number(),
  avgPer1000: z.number(),
  priceBeets: z.number(),
  priceFbeets: z.number(),
  endTime: z.string(),
  votingApr: z.number(),
});

export type Chart = z.infer<typeof Chart>;

// Example
// round: "Round 26",
// bribedVotes: 12345678,
// bribedVotesRatio: 76.54, //calc bribedVotes/totalVotes*100
// totalVotes: 45678900,
// totalVoter: 567,
// totalBribes: 12345.67,   // send "NaN" if not set
// totalOffers: 4,          // = totalBriber
// avgPer1000: 0.34,        // calc totalBribes/bribedVotes*1000
// priceBeets: 0.0398765,
// priceFbeets: 0.0456789,  // if needed
// endTime: "12/31/2022",   // calc (voteEnd * 1000).toLocaleDateString("en-US")
// votingApr: 19,           // calc totalBribes/priceFbeets/bribedVotes * 2600
