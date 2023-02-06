import { readAllChartdata } from "utils/database/chartdata.db";
import { getEmissionForRound } from "./bribeApr.helper";

export async function updateAllChartdata() {
  const chartdata = await readAllChartdata();
  if (!chartdata) return null;
  for (const singlechart of chartdata) {
    const round = singlechart.round;
    const data = await getEmissionForRound(+round);
    let roi = data?.avgBribeRoiInPercent ?? 0;
    if (isNaN(roi)) roi = 0;
    console.log("roi: ", roi);
    // const res = await updateChartdata(round, roi);
    const res = { round: null };
    console.log(res?.round ?? "00");
  }
  const results = await readAllChartdata();
  return results;
}
