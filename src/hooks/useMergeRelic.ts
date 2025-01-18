import type { UseToastOptions } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import ReliquaryAbi from "utils/abi/Reliquary.json";
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";

// const RELIC_CONTRACT = "0x1ed6411670c709f4e163854654bd52c74e66d7ec";
const RELIC_CONTRACT = "0x973670ce19594f857a7cd85ee834c7a74a941684";

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

  const isEnabled = !!Number(fromId) && !!Number(toId);

  const { config, isError: mayFail } = usePrepareContractWrite({
    address: RELIC_CONTRACT,
    abi: ReliquaryAbi,
    functionName: "merge",
    args: [Number(fromId), Number(toId)],
    enabled: isEnabled,
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
    isEnabled,
  };
}
