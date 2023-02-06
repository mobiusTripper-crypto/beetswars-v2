import snapshot from "@snapshot-labs/snapshot.js";
import { useQuery } from "@tanstack/react-query";

export const useGetVp = (proposal: string | undefined, address: string | undefined) =>
  useQuery({
    queryKey: ["votingPower", proposal, address],
    queryFn: () => fetchVotingPower(proposal, address),
    refetchInterval: 0,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
    cacheTime: Infinity,
    staleTime: Infinity,
    enabled: !!proposal,
  });

async function fetchVotingPower(proposal: string | undefined, address: string | undefined) {
  console.log("prop:", proposal);
  console.log("addr:", address);

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
  } else {
    return 0;
  }
}

const strategies = [
  {
    name: "erc20-balance-of",
    network: "250",
    params: {
      symbol: "fBEETS",
      address: "0xfcef8a994209d6916EB2C86cDD2AFD60Aa6F54b1",
      decimals: 18,
    },
  },
  {
    name: "masterchef-pool-balance",
    network: "250",
    params: {
      pid: "22",
      symbol: "fBEETS-STAKED",
      weight: 1,
      decimals: 18,
      tokenIndex: null,
      chefAddress: "0x8166994d9ebBe5829EC86Bd81258149B87faCfd3",
      uniPairAddress: null,
      weightDecimals: 0,
    },
  },
  {
    name: "delegation",
    network: "250",
    params: {
      symbol: "fBeets (delegated)",
      strategies: [
        {
          name: "erc20-balance-of",
          params: {
            symbol: "fBeets",
            address: "0xfcef8a994209d6916eb2c86cdd2afd60aa6f54b1",
            decimals: 18,
          },
        },
        {
          name: "masterchef-pool-balance",
          params: {
            pid: "22",
            symbol: "fBeets-STAKED",
            weight: 1,
            decimals: 18,
            tokenIndex: null,
            chefAddress: "0x8166994d9ebBe5829EC86Bd81258149B87faCfd3",
            uniPairAddress: null,
            weightDecimals: 0,
          },
        },
      ],
    },
  },
];
