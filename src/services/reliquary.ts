import { formatFixed } from "@ethersproject/bignumber";
import type { Provider } from "@wagmi/core";
import type { BigNumber } from "ethers";
import { Contract } from "ethers";
import ReliquaryAbi from "utils/abi/Reliquary.json";

const RELIC_CONTRACT = "0x1ed6411670c709f4e163854654bd52c74e66d7ec";

type AmountHumanReadable = string;

export type ReliquaryFarmPosition = {
  farmId: string;
  relicId: string;
  amount: AmountHumanReadable;
  entry: number;
  level: number;
};

class ReliquaryService {
  constructor(
    private readonly reliquaryContractAddress: string // private readonly chainId: string, // private readonly beetsAddress: string
  ) {}

  public async getAllPositions({
    userAddress,
    provider,
  }: {
    userAddress: string;
    provider: Provider;
  }): Promise<ReliquaryFarmPosition[]> {
    const reliquary = new Contract(this.reliquaryContractAddress, ReliquaryAbi, provider);
    const relicPositions: {
      relicIds: BigNumber[];
      positionInfos: {
        amount: BigNumber;
        rewardDebt: BigNumber;
        rewardCredit: BigNumber;
        entry: BigNumber;
        poolId: BigNumber;
        level: BigNumber;
        genesis: BigNumber;
        lastMaturityBonus: BigNumber;
      }[];
    } = await reliquary.relicPositionsOfOwner(userAddress);
    return relicPositions.positionInfos.map((position, index) => ({
      farmId: position.poolId.toString(),
      relicId: relicPositions.relicIds[index]?.toString() || "",
      amount: formatFixed(position.amount, 18),
      entry: position.entry.toNumber(),
      level: position.level.toNumber(),
    }));
  }
}

export const reliquaryService = new ReliquaryService(
  RELIC_CONTRACT
  //   networkConfig.chainId,
  //   networkConfig.beets.address
);
