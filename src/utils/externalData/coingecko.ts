export async function getCoingeckoPrice(token: string, at: number) {
  if (Math.floor(Date.now() / 1000) < at) return 0;
  const ts1 = at.toString();
  const ts2 = (at + 86400).toString();
  const url = `https://api.coingecko.com/api/v3/coins/${token}/market_chart/range?vs_currency=usd&from=${ts1}&to=${ts2}`;
  let answer = 0;
  try {
    const result = await fetch(url);
    if (result.ok) {
      const data = await result.json();
      answer = data.prices[0][1];
    }
  } catch (error) {
    return 0;
  }
  return answer;
}
