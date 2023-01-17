import { request, gql } from "graphql-request";

export async function getBeetsPerBlock(block: number): Promise<number> {
  const queryUrl =
    "https://api.thegraph.com/subgraphs/name/beethovenxfi/masterchefv2";
  const query = gql`
  query {
    masterChefs(first: 1, block:{number: ${block}}) {
      beetsPerBlock
    }
  }
  `;
  const { masterChefs } = (await request(queryUrl, query)) as {
    masterChefs: { beetsPerBlock: number }[];
  };
  const value = masterChefs[0];
  if (!value) return 0;
  return value.beetsPerBlock / 10 ** 18;
}
