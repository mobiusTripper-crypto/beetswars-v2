import { trpc } from "utils/trpc";

export const useVoteState = () => {
  const bribeData = trpc.bribes.list.useQuery(
    { round: 0 },
    {
      refetchOnWindowFocus: false,
      refetchInterval: 0,
      staleTime: Infinity,
    }
  ).data?.bribefile;

  let loaded = false;
  let result = false;

  if (bribeData) {
    loaded = true;
  }

  if (bribeData?.header.voteState) {
    switch (bribeData.header.voteState) {
      case "closed":
        result = true;
        break;
      default:
        result = false;
    }
  }
  return { data: result, loaded: loaded };
};
