import { request, gql } from "graphql-request";

// get historic price for single token
export async function getTokenPrice(timestamp: number, address: string): Promise<number> {
  type Chartdata = { id: string; price: string; timestamp: number };
  const queryUrl = "https://backend-v2.beets-ftm-node.com/graphql";
  const query = gql`
    query Chartdata {
      tokenGetPriceChartData(
        address: "${address.toLowerCase()}"
        range: THIRTY_DAY
      ) {
        id
        price
        timestamp
      }
    }
  `;
  try {
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
  } catch (error) {
    console.error("Beetswars backend: ", error);
    return 0;
  }
}

// get historic price for BPT pool
export async function getPoolPriceHist(timestamp: number, address: string): Promise<number> {
  type PoolChartdata = { sharePrice: string; timestamp: number };
  const queryUrl = "https://backend-v2.beets-ftm-node.com/graphql";
  const query = gql`
    query PoolData {
      poolGetSnapshots(
        id: "${address}"
        range: THIRTY_DAYS
      ) {
        sharePrice
        timestamp
      }
    }
  `;
  try {
    const { poolGetSnapshots } = (await request(queryUrl, query)) as {
      poolGetSnapshots: PoolChartdata[];
    };
    const result = poolGetSnapshots.reduce(
      (max, current) => {
        if (Number(current.timestamp) <= timestamp && Number(current.timestamp) > max.timestamp) {
          return current;
        }
        return max;
      },
      { sharePrice: "", timestamp: 0 }
    );
    return +result.sharePrice;
  } catch (error) {
    console.error("Beetswars backend: ", error);
    return 0;
  }
}

// get current price for BPT pool
export async function getPoolPriceLive(address: string): Promise<number> {
  type PoolData = {
    dynamicData: {
      totalLiquidity: string;
      totalShares: number;
    };
  };
  const queryUrl = "https://backend-v2.beets-ftm-node.com/graphql";
  const query = gql`
    query PoolData {
      poolGetPool(
        id: "${address}"
      ) {
        dynamicData{
          totalLiquidity
          totalShares
        }
      }
    }
  `;
  try {
    const { poolGetPool } = (await request(queryUrl, query)) as {
      poolGetPool: PoolData;
    };
    const result =
      Number(poolGetPool.dynamicData.totalLiquidity) / Number(poolGetPool.dynamicData.totalShares);
    return result;
  } catch (error) {
    console.error("Beetswars backend: ", error);
    return 0;
  }
}
