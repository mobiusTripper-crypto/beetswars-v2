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

const mergeSuccess = (): UseToastOptions => ({
  title: "Merge Successful.",
  description: "Your relic was merged successfully",
  status: "success",
  ...defaultOptions,
});

const mergeFailure = (): UseToastOptions => ({
  title: "Merge Failed.",
  description: "The relic was not merged",
  status: "error",
  ...defaultOptions,
});

export function useMergeRelic(fromId: string, toId: string) {
  const toast = useToast();
  const account = useAccount();

console.log("merge", fromId, toId) 

  const { config, isError: mayFail } = usePrepareContractWrite({
    address: RELIC_CONTRACT,
    abi: ReliquaryAbi,
    functionName: "merge",
    args: [Number(fromId), Number(toId)],
    enabled: !!Number(fromId) && !!Number(toId),
  });

  const { write, isError, data } = useContractWrite({
    onError: () => toast(mergeFailure()),
    ...config,
  });

  const { isSuccess, isLoading } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: () => toast(mergeSuccess()),
    onError(e) {
      console.error(e);
      toast(mergeFailure());
    },
  });

  return {
    merge: write,
    isMerging: isLoading,
    isSuccess,
    isError,
    mayFail,
  };
}
