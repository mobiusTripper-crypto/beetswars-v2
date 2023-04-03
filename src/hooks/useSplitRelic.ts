import type { UseToastOptions } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import ReliquaryAbi from "utils/abi/Reliquary.json";
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

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

  const arg_amount = parseFloat(amount) / 10 ** 18;

  console.log(toAddress, relicId, Number(arg_amount));

  const { config, isError: mayFail } = usePrepareContractWrite({
    address: RELIC_CONTRACT,
    abi: ReliquaryAbi,
    functionName: "split",
    args: [Number(relicId), Number(arg_amount), toAddress],
    //    enabled: (Number(relicId) > 0 && !!toAddress && Number(amount) > 0),
    enabled: false,
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



