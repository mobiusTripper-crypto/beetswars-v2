import { ethers } from "ethers";
import { contract_abi, contract_address } from "./priceOracleConfig";

const providerUrl = "https://rpc.ftm.tools";

export async function getRpcPrice(tokenAddress: string): Promise<number> {
  if (!tokenAddress) return 0;
  const provider = new ethers.providers.JsonRpcProvider(providerUrl);
  const contract = new ethers.Contract(contract_address, contract_abi, provider);
  const priceobj = await contract.calculateAssetPrice(tokenAddress);
  const price = parseFloat(ethers.utils.formatEther(priceobj));
  return price;
}

export async function getTotalFbeets(): Promise<number> {
  const fbeetsContract = "0xfcef8a994209d6916EB2C86cDD2AFD60Aa6F54b1";
  const provider = new ethers.providers.JsonRpcProvider(providerUrl);
  const contract = new ethers.Contract(fbeetsContract, fbeetsAbi, provider);
  const supplyobj = await contract.totalSupply();
  const supply = parseInt(ethers.utils.formatEther(supplyobj));
  return supply;
}

const fbeetsAbi = [
  {
    inputs: [{ internalType: "contract IERC20", name: "_vestingToken", type: "address" }],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];

export async function getTsByBlock(block: number): Promise<number> {
  try {
    const provider = new ethers.providers.JsonRpcProvider(providerUrl);
    const res = await provider.getBlock(block);
    if (!res) {
      console.error("failed RPC getTsByBlock");
      return 0;
    }
    return res.timestamp || 0;
  } catch (error) {
    console.error("failed RPC getTsByBlock");
    return 0;
  }
}

export async function getBlockByTs2(ts: number): Promise<number> {
  const provider = new ethers.providers.JsonRpcProvider(providerUrl);
  const now = Math.round(Date.now() / 1000);
  let maxBlock = await provider.getBlockNumber();
  let minBlock = maxBlock - (now - ts) * 4; // first guess
  if ((await provider.getBlock(minBlock)).timestamp > ts) minBlock = 0;
  let midTs = 0;
  let midBlock = Math.round((minBlock + maxBlock) / 2);
  do {
    midTs = (await provider.getBlock(midBlock)).timestamp;
    if (midTs >= ts) maxBlock = midBlock;
    else minBlock = midBlock;
    midBlock = Math.round((minBlock + maxBlock) / 2);
  } while (minBlock + 1 !== maxBlock);
  return maxBlock;
}
