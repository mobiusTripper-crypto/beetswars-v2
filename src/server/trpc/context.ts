import { type inferAsyncReturnType } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { getSession } from "next-auth/react";

/**
 * Replace this with an object if you want to pass things to createContextInner
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type CreateContextOptions = Record<string, never>;

/** Use this helper for:
 * - testing, so we dont have to mock Next.js' req/res
 * - trpc's `createSSGHelpers` where we don't have req/res
 * @see https://create.t3.gg/en/usage/trpc#-servertrpccontextts
 **/
// export const createContextInner = async (opts: CreateContextOptions) => {
//   return {};
// };

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
export const createContext = async (opts: CreateNextContextOptions) => {
  const session = await getSession({ req: opts.req });
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return session!;
};

export type Context = inferAsyncReturnType<typeof createContext>;
