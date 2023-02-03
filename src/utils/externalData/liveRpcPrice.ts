import { ethers } from "ethers";
import { contract_abi, contract_address } from "./priceOracleConfig";

export async function getRpcPrice(tokenAddress: string): Promise<number> {
  if (!tokenAddress) return 0;
  const provider = new ethers.providers.JsonRpcProvider("https://rpc.ftm.tools");
  const contract = new ethers.Contract(contract_address, contract_abi, provider);
  const priceobj = await contract.calculateAssetPrice(tokenAddress);
  const price = parseFloat(ethers.utils.formatEther(priceobj));
  return price;
}
