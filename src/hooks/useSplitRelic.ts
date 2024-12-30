import type { UseToastOptions } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import ReliquaryAbi from "utils/abi/Reliquary.json";
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import type { BigNumber } from "ethers";
import { type EthAddressType, EthAddress } from "types/ethAdress.raw";

// const RELIC_CONTRACT = "0x1ed6411670c709f4e163854654bd52c74e66d7ec";
const RELIC_CONTRACT = "0x973670ce19594f857a7cd85ee834c7a74a941684";

const defaultOptions: Partial<UseToastOptions> = {
  duration: 5000,
  isClosable: true,
  position: "bottom-right",
};

const splitSuccess = (): UseToastOptions => ({
  title: "Split Successful.",
  description: "Your relic was split successfully",
  status: "success",
  ...defaultOptions,
});

const splitFailure = (): UseToastOptions => ({
  title: "Split Failed.",
  description: "The relic was not split",
  status: "error",
  ...defaultOptions,
});

export function useSplitRelic(toAddress: EthAddressType, relicId: string, amount: BigNumber) {
  const toast = useToast();

  const isEnabled = EthAddress.safeParse(toAddress).success && Number(relicId) > 0 && amount.gt(0);

  const { config, isError: mayFail } = usePrepareContractWrite({
    address: RELIC_CONTRACT,
    abi: ReliquaryAbi,
    functionName: "split",
    args: [Number(relicId), amount, toAddress],
    enabled: isEnabled,
  });

  const { write, isError, data } = useContractWrite({
    onError: () => toast(splitFailure()),
    ...config,
  });

  const { isSuccess, isLoading } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: () => toast(splitSuccess()),
    onError(e) {
      console.error(e);
      toast(splitFailure());
    },
  });

  return {
    split: write,
    isSplitting: isLoading,
    isSuccess,
    isError,
    mayFail,
    isEnabled,
  };
}
