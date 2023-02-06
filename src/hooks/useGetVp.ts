import snapshot from "@snapshot-labs/snapshot.js";
import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { trpc } from "utils/trpc";
import { useGlobalContext } from "contexts/GlobalContext";
import type { SpaceStrategy } from "types/bribelist.trpc";
import { Strategy } from "@snapshot-labs/snapshot.js/dist/voting/types";

const votingActive = false;
let strategies: Strategy[];

export const useGetVp = () => {
  const { requestedRound } = useGlobalContext();
  const bribeData = trpc.bribes.list.useQuery(
    { round: requestedRound },
    {
      refetchOnWindowFocus: votingActive,
      refetchInterval: votingActive ? 60000 : 0,
      staleTime: votingActive ? 60000 : Infinity,
      enabled: !!requestedRound,
    }
  ).data?.bribefile;
  const proposal = bribeData?.header.proposal;

  const st = bribeData?.strategies;

  strategies = st as unknown as Strategy[];

  const account = useAccount();

  console.log(bribeData);

  const { data: vp } = useQqueryVp(proposal, account.address);
  if (vp) {
    return vp;
  }
  return 0;
};

const useQqueryVp = (proposal: string | undefined, address: string | undefined) =>
  useQuery({
    queryKey: ["votingPower", address],
    queryFn: () => getVotingPower(proposal, address),
    refetchInterval: 0,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
    cacheTime: Infinity,
    staleTime: Infinity,
  });

async function getVotingPower(proposal: string | undefined, address: string | undefined) {
  console.log("prop:", proposal);
  console.log("addr:", address);
  console.log("strat:", strategies);

  const network = "250";
  const space = "beets.eth";
  const delegation = false;
  //  const strategies = [];

  if (address && proposal) {
    const votingPower = await snapshot.utils.getVp(
      address,
      network,
      strategies,
      parseInt(proposal),
      space,
      delegation
    );
    console.log(votingPower);
    return votingPower.vp;
  }
  return 0;
}
