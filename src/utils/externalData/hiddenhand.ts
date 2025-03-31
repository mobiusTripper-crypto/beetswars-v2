import { type HiddenhandEntry } from "types/hiddenhand.raw";

export async function getHiddenhandBribes(): Promise<HiddenhandEntry[]> {
  const url = "https://api.hiddenhand.finance/proposal/beets";
  try {
    const result = await fetch(url);
    if (result.status !== 200) throw new Error("HTTP "+result.status);
    const body = await result.json();
    if (body.error) throw new Error("Hiddenhand data error");
    return body.data as HiddenhandEntry[];

  } catch (error) {
    console.error("failed HiddenHand API", error);
    return [];
  }
} 