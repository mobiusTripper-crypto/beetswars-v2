import type { UseToastOptions } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import ReliquaryAbi from "utils/abi/Reliquary.json";
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { ethers } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import { BigNumber } from "ethers";

const RELIC_CONTRACT = "0x1ed6411670c709f4e163854654bd52c74e66d7ec";

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

export function useSplitRelic(toAddress: string, relicId: string, amount: string) {
  const toast = useToast();
  const account = useAccount();
  let arg_amount = BigNumber.from(0);

  if (amount) {
    arg_amount = parseUnits(amount);
  }

  console.log("split args:", Number(relicId), arg_amount, toAddress);

  const { config, isError: mayFail } = usePrepareContractWrite({
    address: RELIC_CONTRACT,
    abi: ReliquaryAbi,
    functionName: "split",
    args: [Number(relicId), arg_amount, toAddress],
    enabled: Number(relicId) > 0 && !!toAddress && !arg_amount.eq(0)
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
  };
}
