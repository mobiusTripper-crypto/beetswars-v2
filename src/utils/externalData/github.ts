import { type Automation } from "types/github.raw";

export async function getAutomationData(voteEnd: number): Promise<Automation | null> {
  if (!voteEnd) return null; // no voteEnd found
  // human readable link: https://github.com/beethovenxfi/ops-automation/tree/main/src/gaugeAutomation/gauge-data
  const githubUrl = `https://raw.githubusercontent.com/beethovenxfi/ops-automation/refs/heads/main/src/gaugeAutomation/gauge-data/${voteEnd}.json`;
  try {
    const response = await fetch(githubUrl);
    if (response.ok) {
      const data = await response.json();
      if (!data) return null; // no emission found
      return data; // return emission
    }
    return null; // no data found
  } catch (error) {
    console.error("failed getAutomationData: ", error);
    return null;
  }
}
