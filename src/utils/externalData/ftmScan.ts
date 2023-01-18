const apikey = process.env.FTMSCAN_APIKEY as string;

export async function getBlockByTs(ts: number): Promise<number> {
  console.log("ftmscan getBlockByTs");
  const url = `https://api.ftmscan.com/api?module=block&action=getblocknobytime&timestamp=${ts}&closest=before&apikey=${apikey}`;
  try {
    const b = await fetch(url);
    const res: { status: string; message: string; result: string } =
      await b.json();
    if (!res || res.status !== "1") return 0;
    return +res.result;
  } catch (error) {
    return 0;
  }
}
