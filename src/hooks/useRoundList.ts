import { trpc } from "utils/trpc";
import type { RoundlistNum } from "types/roundlist.trpc";
export const useRoundList = () => {
  const roundList = trpc.rounds.list.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchInterval: 0,
    staleTime: Infinity,
  }).data?.data ?? {
    rounds: [] as number[],
    latest: 0,
  };
  let loaded = false;
  let result: RoundlistNum = [] as unknown as RoundlistNum
  if (roundList.latest !== 0 ) {
    result = roundList;
    loaded = true;
  }
  return { data: result, loaded: loaded };
};
export default useRoundList
