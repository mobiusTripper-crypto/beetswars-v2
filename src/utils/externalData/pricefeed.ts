import type { Tokendata } from "types/bribedata.raw";
import { getPoolPriceHist, getPoolPriceLive, getTokenPrice, getTokenPriceLive } from "./beetsBack";
import { getCoingeckoCurrentPrice, getCoingeckoPrice } from "./coingecko";
// import { getRpcPrice } from "./liveRpcQueries"; // not for Sonic
import { findTokenEntry, updateTokenPriceCache } from "utils/database/tokens.db";

export async function getPrice(
  history: boolean,
  token: Tokendata,
  timestamp?: number
): Promise<number> {
  if (history) {
    if (!timestamp) return 0;
    if (token.lastprice) return token.lastprice;
    if (token.coingeckoid) {
      const price = await getCoingeckoPrice(token.coingeckoid, timestamp);
      if (price) return price;
    }
    if (token.isbpt && token.tokenaddress)
      return await getPoolPriceHist(timestamp, token.tokenaddress);
    if (token.tokenaddress) return await getTokenPrice(timestamp, token.tokenaddress);
    return 0;
  }
  if (token.tokenaddress) {
    if (token.isbpt && token.bptpoolid) {
      let price = await getPoolPriceLive(token.bptpoolid);
      if (!price) price = await getPoolPriceHist(Date.now() ,token.bptpoolid);
      return price || 0;
    }
    const price = await getTokenPriceCached(token.tokenaddress); // switch to "let" if more pricefeeds available
    // let price = await getTokenPriceLive(token.tokenaddress);
    // if (!price) price = await getRpcPrice(token.tokenaddress); // not for Sonic
    if (price) return price;
  }
  if (token.coingeckoid) return await getCoingeckoCurrentPrice(token.coingeckoid);
  return 0;
}

export async function getTokenPriceCached(address: string): Promise<number> {
  const now = Date.now();
  const cacheEntry = await findTokenEntry( address );

  if (cacheEntry && cacheEntry.cacheprice && cacheEntry.cachetimestamp && now - cacheEntry.cachetimestamp < 60000) { // 60 Sekunden
    return cacheEntry.cacheprice;
  }

  const cacheprice = await getTokenPriceLive(address);
  if(cacheprice) await updateTokenPriceCache(address, cacheprice, now);
  return cacheprice;
}