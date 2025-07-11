import { request, gql } from "graphql-request";
import type { RelicCount, RelicList } from "types/theGraph.raw"; // RelicPoolLevels
// import { getBlockByTsRPC } from "./liveRpcQueries";

const RELIC_CONTRACT = "0x1ed6411670c709f4e163854654bd52c74e66d7ec";

const apikey = process.env.THEGRAPH_APIKEY as string;

export async function getBeetsPerBlock(block: number): Promise<number> {
  // const queryUrl = "https://api.studio.thegraph.com/query/73674/masterchefv2/version/latest/";
  const queryUrl = "https://gateway.thegraph.com/api/" + apikey + "/deployments/id/QmUM8aU6H3gFx6JL65GQV5baPPjczU9hUb6VRiDQ1jEp3B";
  const query = gql`
  query {
    masterChefs(first: 1, block:{number: ${block}}) {
      beetsPerBlock
    }
  }
  `;
  try {
    const { masterChefs } = (await request(queryUrl, query)) as {
      masterChefs: { beetsPerBlock: number }[];
    };
    const value = masterChefs[0];
    if (!value) {
      console.error("failed query theGraph BeetsPerBlock");
      return 0;
    }
    return value.beetsPerBlock / 10 ** 18;
  } catch (error) {
    console.error("failed query theGraph BeetsPerBlock");
    return 0;
  }
}

// export async function getBlockByTsGraph(ts: number): Promise<number> {
//   const queryUrl = "https://gateway-arbitrum.network.thegraph.com/api/" + apikey + "/subgraphs/id/3drjZDpA9hAuYGA19ttEkhW432mVe2XHy5YarBDVYHbz";
//   const query = gql`
//     query {
//       blocks(
//         orderDirection: desc
//         orderBy: timestamp
//         where: { timestamp_gt: ${ts - 10}, timestamp_lt: ${ts + 10}}
//       ) {
//         timestamp
//         number
//       }
//     }
//   `;
//   try {
//     const { blocks } = (await request(queryUrl, query)) as Blocks;
//     if (!blocks) {
//       console.log("no blocks by theGraph");
//       return await getBlockByTsRPC(ts);
//     }
//     const closest = blocks.reduce((a, b) => {
//       return Math.abs(+b.timestamp - ts) < Math.abs(+a.timestamp - ts) ? b : a;
//     });
//     return Number(closest.number);
//   } catch (error) {
//     console.error("no blocks by theGraph, trying RPC");
//     return await getBlockByTsRPC(ts);
//   }
// }

export async function getRelicsFbeetsLocked(
  block: number,
  voterAdresses?: string[]
): Promise<number> {
  // const queryUrl = "https://api.studio.thegraph.com/query/73674/mabeets-sonic/version/latest/";
  const queryUrl = "https://gateway.thegraph.com/api/" + apikey + "/deployments/id/QmUM8aU6H3gFx6JL65GQV5baPPjczU9hUb6VRiDQ1jEp3B";
  try {
    let allResults: RelicList[] = [];
    const first = 1000;
    let id = 0;
    let hasMore = true;
    while (hasMore) {
      const query = gql`
        query fbeetsLocked {
          relics(
            block: {number: ${block}}
            where: {
              userAddress_not: "0x0000000000000000000000000000000000000000"
              relicId_gt: ${id}
              balance_gt: 0
              }
            first: ${first}
            orderBy: relicId
            orderDirection: asc
          ) {
            relicId
            balance
            userAddress
          }
        }`;
      const result = await request(queryUrl, query);
      allResults = [...allResults, ...result.relics];
      hasMore = result.relics.length === first;
      id = result.relics[result.relics.length - 1].relicId;
    }
    if (!allResults) return 0;

    const filteredRelics = !voterAdresses
      ? allResults
      : allResults.filter(x => voterAdresses.includes(x.userAddress.toLowerCase()));

    const total = filteredRelics.reduce((sum, x) => sum + parseFloat(x.balance), 0);
    return total;
  } catch (error) {
    console.error("failed query theGraph getRelicsFbeetsLocked");
    console.error(error);
    return 0;
  }
}

// export async function getRelicsFbeetsLocked(
//   block: number,
//   voterAdresses?: string[]
// ): Promise<number> {
//   const queryUrl = "https://api.studio.thegraph.com/query/73674/reliquary/version/latest/";
//   try {
//     let allResults: RelicBalance[] = [];
//     const first = 1000;
//     let skip = 0;
//     let hasMore = true;
//     while (hasMore) {
//       const query = gql`
//         query fbeetsLocked {
//           users(
//             block: {number: ${block}}
//             where: {address_not_in: ["0x0000000000000000000000000000000000000000"]}
//             first: ${first}
//             skip: ${skip}
//           ) {
//             address
//             relics {
//               relicId
//               balance
//             }
//           }
//         }`;
//       const result = await request(queryUrl, query);
//       allResults = [...allResults, ...result.users];
//       hasMore = result.users.length === first;
//       skip += first;
//       console.log ("Skip: ", skip, " hasMore: ", hasMore, " Blocksize: ", result.users.length);
//       console.log ("first: ", result.users[998]);
//       console.log ("last: ", result.users[999]);
//     }
//     if (!allResults) return 0;

//     const filteredUsers = !voterAdresses
//       ? allResults
//       : allResults.filter(x => voterAdresses.includes(x.address.toLowerCase()));
//     const userBalances = filteredUsers.map(x => {
//       return {
//         address: x.address,
//         balance: x.relics.reduce((sum, x) => {
//           return sum + parseFloat(x.balance);
//         }, 0),
//       };
//     });
//     const total = userBalances.reduce((sum, x) => sum + x.balance, 0);
//     return total;
//   } catch (error) {
//     console.error("failed query theGraph getRelicsFbeetsLocked");
//     console.error(error);
//     return 0;
//   }
// }

export async function getRelicCount(block: number): Promise<number> {
  // const queryUrl = "https://api.studio.thegraph.com/query/73674/mabeets-sonic/version/latest/";
  const queryUrl = "https://gateway.thegraph.com/api/" + apikey + "/deployments/id/QmUM8aU6H3gFx6JL65GQV5baPPjczU9hUb6VRiDQ1jEp3B";
  const query = gql`
  query {
    reliquaries(
      block: {number: ${block}}
      where: {id: "${RELIC_CONTRACT}"}
    ) {
      relicCount
      id
      pools(where: {pid: 2}) {
        pid
        relicCount
      }
    }
  }
  `;
  try {
    const { reliquaries } = (await request(queryUrl, query)) as RelicCount;
    if (!reliquaries) return 0;
    const count = reliquaries[0]?.pools[0]?.relicCount || 0;
    return count;
  } catch (error) {
    console.error("failed query theGraph getRelicCount");
    return 0;
  }
}

// export async function getRelicLevelInfo(block: number) {
//   const queryUrl = "https://api.studio.thegraph.com/query/73674/mabeets-sonic/version/latest/";
//   const query = gql`
//   query {
//     poolLevels(
//       block: {number: ${block}}
//       where: {pool_: {pid: 2, reliquary: "${RELIC_CONTRACT}"}}
//     ) {
//       allocationPoints
//       balance
//       level
//       pool {
//         pid
//         relicCount
//         totalBalance
//       }
//     }
//   }
//   `;
//   try {
//     const { poolLevels } = (await request(queryUrl, query)) as RelicPoolLevels;
//     if (!poolLevels) return null;
//     const relicCount = poolLevels[0]?.pool.relicCount || 0;
//     const totalFbeets = poolLevels[0]?.pool.totalBalance || 0;
//     const maxPoints =
//       poolLevels.reduce((max, x) => (x.allocationPoints > max ? x.allocationPoints : max), 0) ||
//       100;
//     const levels = poolLevels.map(x => {
//       return {
//         level: x.level,
//         weight: x.allocationPoints,
//         balance: x.balance,
//         votingPower: (x.allocationPoints * x.balance) / maxPoints,
//       };
//     });
//     const totalVotingPower = levels.reduce((sum, x) => sum + x.votingPower, 0);
//     return { relicCount, totalFbeets, totalVotingPower, levels };
//   } catch (error) {
//     console.error("failed query theGraph getRelicCount");
//     return null;
//   }
// }
