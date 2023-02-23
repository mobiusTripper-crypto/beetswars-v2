import { TRPCError } from "@trpc/server";
import { type Session } from "next-auth";
import { Bribedata, Bribefile, Reward, Tokendata } from "types/bribedata.raw";
import getBribeData from "utils/api/bribedata.helper";
import {
  addOffer,
  addRound,
  addToken,
  deleteOffer,
  deleteToken,
  editOffer,
  editRound,
  editToken,
  addReward,
  editReward,
  deleteReward,
  suggestData,
} from "utils/api/editBribedata";
import { readOneBribefile } from "utils/database/bribefile.db";
import { z } from "zod";
import { router, publicProcedure } from "../trpc";

// This tRPC endpoint gives back bribedata for one round in 2 possible formats:
// - list: All values are calculated and ready for display
// - list_raw: pure JSON format, as saved in database
// And it provides several functions to mutate bribe data:
// - addRound: create a new database document with basic round data
// - editRound: edit basic round data for given round id
// - addToken: create a new entry with tokendata for given round
// - editToken: edit tokendata for given round and token id
// - deleteToken: delete tokendata for given round and token id
// - addOffer: create a new entry of a bribe offer for given round
// - editOffer: edit bribedata for given round and offer id
// - deleteOffer: delete bribedata for given round and offer id
// - addReward: create a new reward entry into a bribe offer for given round
// - editReward: edit reward data for given round and offer id
// - deleteReward: delete reward for given round, offer and reward id, except of last
// Helper for form data:
// - suggest: retrieve a list of vote options, add previous round data if available

export const bribedataRouter = router({
  list: publicProcedure
    .input(z.object({ round: z.number().nullish() }).nullish())
    .query(async ({ input }) => {
      return {
        bribefile: await getBribeData(input?.round ?? undefined),
      };
    }),
  list_raw: publicProcedure
    .input(z.object({ round: z.number().nullish() }).nullish())
    .query(async ({ input }) => {
      return {
        bribefile: await readOneBribefile(input?.round ?? 0),
      };
    }),
  addRound: publicProcedure.input(Bribefile).mutation(async ({ input, ctx }) => {
    const session = ctx as Session;
    if (!session.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    const result = await addRound(input);
    return result;
  }),
  editRound: publicProcedure.input(Bribefile).mutation(async ({ input, ctx }) => {
    const session = ctx as Session;
    if (!session.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    const result: Bribefile | null = await editRound(input);
    return result;
  }),
  addToken: publicProcedure
    .input(z.object({ payload: Tokendata, round: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const session = ctx as Session;
      if (!session.user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      const result: Tokendata[] | null = await addToken(input.payload, input.round);
      return result;
    }),
  editToken: publicProcedure
    .input(z.object({ payload: Tokendata, round: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const session = ctx as Session;
      if (!session.user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      const result = await editToken(input.payload, input.round);
      return result;
    }),
  deleteToken: publicProcedure
    .input(z.object({ tokenId: z.number(), round: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const session = ctx as Session;
      if (!session.user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      const result = await deleteToken(input.tokenId, input.round);
      return result;
    }),
  addOffer: publicProcedure
    .input(z.object({ payload: Bribedata, round: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const session = ctx as Session;
      if (!session.user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      const result: Bribedata[] | null = await addOffer(input.payload, input.round);
      return result;
    }),
  editOffer: publicProcedure
    .input(z.object({ payload: Bribedata, round: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const session = ctx as Session;
      if (!session.user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      const result: Bribedata[] | null = await editOffer(input.payload, input.round);
      return result;
    }),
  deleteOffer: publicProcedure
    .input(z.object({ offerId: z.number(), round: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const session = ctx as Session;
      if (!session.user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      const result = await deleteOffer(input.offerId, input.round);
      return result;
    }),
  addReward: publicProcedure
    .input(z.object({ payload: Reward, round: z.number(), offer: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const session = ctx as Session;
      if (!session.user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      const result = await addReward(input.payload, input.round, input.offer);
      return result;
    }),
  editReward: publicProcedure
    .input(z.object({ payload: Reward, round: z.number(), offer: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const session = ctx as Session;
      if (!session.user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      const result = await editReward(input.payload, input.round, input.offer);
      return result;
    }),
  deleteReward: publicProcedure
    .input(z.object({ round: z.number(), offer: z.number(), reward: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const session = ctx as Session;
      if (!session.user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      const result = await deleteReward(input.round, input.offer, input.reward);
      return result;
    }),
  suggest: publicProcedure.input(z.object({ round: z.number() })).query(async ({ input }) => {
    return {
      votelist: await suggestData(input.round),
    };
  }),
});
