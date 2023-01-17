const apikey = process.env.FTMSCAN_APIKEY as string;

export async function getBlockByTs(ts: number): Promise<string> {
  const url = `https://api.ftmscan.com/api?module=block&action=getblocknobytime&timestamp=${ts}&closest=before&apikey=${apikey}`;
  const b = await fetch(url);
  const res: { status: string; message: string; result: string } =
    await b.json();
  return res.result;
}
