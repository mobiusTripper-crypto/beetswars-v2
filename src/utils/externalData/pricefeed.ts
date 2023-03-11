import type { Tokendata } from "types/bribedata.raw";
import { getTokenPrice } from "./beetsBack";
import { getCoingeckoCurrentPrice, getCoingeckoPrice } from "./coingecko";
import { getRpcPrice } from "./liveRpcQueries";

export async function getPrice(history: boolean, token: Tokendata, ts?: number): Promise<number> {
  if (history) {
    if (!ts) return 0;
    if (token.lastprice) return token.lastprice;
    if (token.coingeckoid) {
      const price = getCoingeckoPrice(token.coingeckoid, ts);
      if (price) return price;
    }
    if (token.tokenaddress) return getTokenPrice(ts, token.tokenaddress);
    return 0;
  }
  if (token.tokenaddress) {
    const price = getRpcPrice(token.tokenaddress);
    if (price) return price;
  }
  if (token.coingeckoid) return getCoingeckoCurrentPrice(token.coingeckoid);
  return 0;
}
