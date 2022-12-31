import { request, gql } from "graphql-request";

export async function getTokenPrice(
  timestamp: number,
  address: string
): Promise<number> {
  type Chartdata = { id: string; price: string; timestamp: number };
  const queryUrl = "https://backend-v2.beets-ftm-node.com/graphql";
  const query = gql`
    query Chartdata {
      tokenGetPriceChartData(
        address: "${address}"
        range: THIRTY_DAY
      ) {
        id
        price
        timestamp
      }
    }
  `;
  const { tokenGetPriceChartData } = (await request(queryUrl, query)) as {
    tokenGetPriceChartData: Chartdata[];
  };
  const result = tokenGetPriceChartData.reduce(
    (max, current) => {
      if (current.timestamp <= timestamp && current.timestamp > max.timestamp) {
        return current;
      }
      return max;
    },
    { id: "", price: "", timestamp: 0 }
  );
  return +result.price;
}
