import { type RoundList } from "types/RoundList";
const baseUrl = "/api/v1/bribedata";

export async function fetchRoundIndex(): Promise<RoundList[]> {
  const res = await fetch(baseUrl || "")
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      const list = response
        .map((item: any, i: any) => {
          return item.key;
        })
        .sort()
        .reverse();
      return list;
    });
  console.log("return fetch");
  return res;
}
