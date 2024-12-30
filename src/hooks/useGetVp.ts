import snapshotJS from "@snapshot-labs/snapshot.js";
import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { trpc } from "utils/trpc";
import { useGlobalContext } from "contexts/GlobalContext";
import type { Strategy } from "@snapshot-labs/snapshot.js/dist/voting/types";

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
  const snapshot = bribeData?.header.snapshotBlock;
  const st = bribeData?.strategies;
  strategies = st as unknown as Strategy[];
  const account = useAccount();
  const { data: vp } = useQqueryVp(snapshot, account.address);

  return { data: vp, connected: account.isConnected };
};

const useQqueryVp = (snapshot: number | undefined, address: string | undefined) =>
  useQuery({
    queryKey: ["votingPower", address, snapshot],
    queryFn: () => getVotingPower(snapshot, address),
    refetchInterval: 0,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
    cacheTime: Infinity,
    staleTime: Infinity,
  });

async function getVotingPower(snapshot: number | undefined, address: string | undefined) {
  // const network = "250";
  const network = "146";
  const space = "beets.eth";
  const delegation = false;
  //  const strategies = [];

  if (address && snapshot) {
    try {
      const votingPower = await snapshotJS.utils.getVp(
        address,
        network,
        strategies,
        snapshot,
        space,
        delegation
      );
      console.log(votingPower);
      return votingPower.vp;
    } catch (error) {
      return 0;
    }
  }
  return 0;
}
