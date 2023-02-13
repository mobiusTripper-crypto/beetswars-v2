import { getBlockByTs2 } from "./liveRpcQueries";

const apikey = process.env.FTMSCAN_APIKEY as string;

export async function getBlockByTs(ts: number): Promise<number> {
  const url = `https://api.ftmscan.com/api?module=block&action=getblocknobytime&timestamp=${ts}&closest=before&apikey=${apikey}`;
  try {
    const b = await fetch(url);
    const res: { status: string; message: string; result: string } = await b.json();
    if (!res || res.status !== "1") {
      console.log("getBlockByTs divert to RPC");
      return await getBlockByTs2(ts);
    }
    return +res.result;
  } catch (error) {
    console.error("failed ftmscan getBlockByTs: ", ts);
    return 0;
  }
}

export async function getTsByBlock(block: number): Promise<number> {
  const hexa = "0x" + block.toString(16);
  const url = `https://api.ftmscan.com/api?module=proxy&action=eth_getBlockByNumber&tag=${hexa}&boolean=true&apikey=${apikey}`;
  try {
    const b = await fetch(url);
    const res = await b.json();
    if (!res) {
      console.error("failed ftmscan getTsByBlock");
      return 0;
    }
    const result = res.result.timestamp;
    if (!result) return 0;
    return Number(result);
  } catch (error) {
    console.error("failed ftmscan getTsByBlock");
    return 0;
  }
}
