import { request, gql } from "graphql-request";
import { getBlockByTsRPC } from "./liveRpcQueries";

interface Blocks {
  blocks: {
    timestamp: string;
    number: string;
  }[];
}

interface RelicBalance {
  address: string;
  relics: {
    relicId: number;
    balance: string;
  }[];
}

export async function getBeetsPerBlock(block: number): Promise<number> {
  const queryUrl = "https://api.thegraph.com/subgraphs/name/beethovenxfi/masterchefv2";
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

export async function getBlockByTsGraph(ts: number): Promise<number> {
  const queryUrl = "https://api.thegraph.com/subgraphs/name/beethovenxfi/fantom-blocks";
  const query = gql`
    query {
      blocks(
        orderDirection: desc
        orderBy: timestamp
        where: { timestamp_gt: ${ts - 10}, timestamp_lt: ${ts + 10}}
      ) {
        timestamp
        number
      }
    }
  `;
  try {
    const { blocks } = (await request(queryUrl, query)) as Blocks;
    if (!blocks) {
      return await getBlockByTsRPC(ts);
    }
    const closest = blocks.reduce((a, b) => {
      return Math.abs(+b.timestamp - ts) < Math.abs(+a.timestamp - ts) ? b : a;
    });
    return Number(closest.number);
  } catch (error) {
    console.error("failed query theGraph getBlockByTsGraph");
    return 0;
  }
}

export async function getRelicsFbeetsLocked(
  block: number,
  voterAdresses?: string[]
): Promise<number> {
  const queryUrl = "https://api.thegraph.com/subgraphs/name/beethovenxfi/reliquary";
  try {
    let allResults: RelicBalance[] = [];
    const first = 1000;
    let skip = 0;
    let hasMore = true;
    while (hasMore) {
      const query = gql`
        query fbeetsLocked {
          users(
            block: {number: ${block}}
            where: {address_not_in: ["0x0000000000000000000000000000000000000000"]}
            first: ${first}
            skip: ${skip}
          ) {
            address
            relics {
              relicId
              balance
            }
          }
        }`;
      const result = await request(queryUrl, query);
      allResults = [...allResults, ...result.users];
      hasMore = result.users.length === first;
      skip += first;
    }

    if (!allResults) {
      return 0;
    }

    const filteredUsers = !voterAdresses
      ? allResults
      : allResults.filter(x => voterAdresses.includes(x.address.toLowerCase()));
    const userBalances = filteredUsers.map(x => {
      return {
        address: x.address,
        balance: x.relics.reduce((sum, x) => {
          return sum + parseFloat(x.balance);
        }, 0),
      };
    });
    const total = userBalances.reduce((sum, x) => sum + x.balance, 0);
    return total;
  } catch (error) {
    console.error("failed query theGraph getRelicsFbeetsLocked");
    return 0;
  }
}
