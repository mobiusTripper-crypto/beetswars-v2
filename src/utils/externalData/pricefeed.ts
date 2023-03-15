import type { Tokendata } from "types/bribedata.raw";
import { getTokenPrice } from "./beetsBack";
import { getCoingeckoCurrentPrice, getCoingeckoPrice } from "./coingecko";
import { getRpcPrice } from "./liveRpcQueries";

export async function getPrice(
  history: boolean,
  token: Tokendata,
  timestamp?: number
): Promise<number> {
  if (history) {
    if (!timestamp) return 0;
    if (token.lastprice) return token.lastprice;
    if (token.coingeckoid) {
      const price = getCoingeckoPrice(token.coingeckoid, timestamp);
      if (price) return price;
    }
    if (token.tokenaddress) return getTokenPrice(timestamp, token.tokenaddress);
    return 0;
  }
  if (token.tokenaddress) {
    const price = getRpcPrice(token.tokenaddress);
    if (price) return price;
  }
  if (token.coingeckoid) return getCoingeckoCurrentPrice(token.coingeckoid);
  return 0;
}
