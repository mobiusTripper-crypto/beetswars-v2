import type { Emission } from "types/emission.raw";
import { readEmissionList } from "utils/database/beetsEmissions.db";
import { getTsByBlockRPC } from "utils/externalData/liveRpcQueries";
import { getBeetsPerBlock, getBlockByTsGraph } from "utils/externalData/theGraph";

export async function getEmissionForBlockspan(block1: number, block2: number): Promise<number> {
  const emissionChange = await readEmissionList();
  if (!emissionChange) return 0;
  emissionChange.sort((a, b) => a.block - b.block);

  let currentTokenAmount = 0;
  let sum = 0;
  let lastBlock = block1;

  for (const entry of emissionChange) {
    if (entry.block > block2) break;
    if (entry.block > block1) {
      sum += (entry.block - lastBlock) * currentTokenAmount;
      lastBlock = entry.block;
    }
    currentTokenAmount = entry.beets;
  }
  sum += (block2 - lastBlock + 1) * currentTokenAmount;

  return sum;
}

// find recent beets emission changes
export async function checkEmissionChange(lastEmission: Emission): Promise<Emission[]> {
  const stepwidth = 40000; // estimated between 0.5 and 1 days
  let block = lastEmission.block + stepwidth;
  const oldBeets = lastEmission.beets;
  const currentBlock = await getBlockByTsGraph(Math.floor(Date.now() / 1000) - 60);
  const data = [] as Emission[];
  while (block < currentBlock + stepwidth) {
    const beets = await getBeetsPerBlock(block);
    if (!beets) break;
    if (beets !== oldBeets) {
      const newblock = await findEmissionChangeBlock(block - stepwidth, block);
      const timestamp = await getTsByBlockRPC(newblock);
      data.push({ block: newblock, beets, timestamp });
      block = newblock;
    } else {
      block += stepwidth;
    }
  }
  return data;
}

// find block by continuous halving
export async function findEmissionChangeBlock(
  lowBlock: number,
  highBlock: number
): Promise<number> {
  const beets1 = await getBeetsPerBlock(lowBlock);
  const beets2 = await getBeetsPerBlock(highBlock);
  let beets3 = 0;
  if (beets1 === beets2) return highBlock + 1; // return early if no change
  let mid = Math.round((lowBlock + highBlock) / 2);
  do {
    beets3 = await getBeetsPerBlock(mid);
    if (beets3 === beets1) {
      lowBlock = mid;
    } else {
      highBlock = mid;
    }
    mid = Math.round((lowBlock + highBlock) / 2);
  } while (lowBlock + 1 !== highBlock);
  return highBlock;
}
