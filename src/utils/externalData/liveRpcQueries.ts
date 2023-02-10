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
  const supplyobj = await contract.totalSupply;
  const supply = parseFloat(ethers.utils.formatEther(supplyobj));
  console.log("supply: ", supply);
  // return supply;
  return 0;
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
