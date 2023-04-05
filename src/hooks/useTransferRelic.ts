import type { UseToastOptions } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import ReliquaryAbi from "utils/abi/Reliquary.json";
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import * as z from "zod";

const Address = z.string().regex(/^0x[0-9a-fA-F]{40}$/);
type Address = z.infer<typeof Address>;


const RELIC_CONTRACT = "0x1ed6411670c709f4e163854654bd52c74e66d7ec";

const defaultOptions: Partial<UseToastOptions> = {
  duration: 5000,
  isClosable: true,
  position: "bottom-right",
};

const transferSuccess = (): UseToastOptions => ({
  title: "Transfer Successful.",
  description: "Your relic was transfered successfully",
  status: "success",
  ...defaultOptions,
});

const transferFailure = (): UseToastOptions => ({
  title: "Transfer Failed.",
  description: "The relic was not transfered",
  status: "error",
  ...defaultOptions,
});

export function useTransferRelic(toAddress: Address, relicId: string) {
  const toast = useToast();
  const account = useAccount();

  const { config, isError: mayFail } = usePrepareContractWrite({
    address: RELIC_CONTRACT,
    abi: ReliquaryAbi,
    functionName: "safeTransferFrom",
    args: [account.address, toAddress, Number(relicId)],
    enabled: (Number(relicId) > 0 && !!toAddress),
  });

  const { write, isError, data } = useContractWrite({
    onError: () => toast(transferFailure()),
    ...config,
  });

  const { isSuccess, isLoading } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: () => toast(transferSuccess()),
    onError(e) {
      console.error(e);
      toast(transferFailure());
    },
  });

  return {
    transfer: write,
    isTransfering: isLoading,
    isSuccess,
    isError,
    mayFail,
  };
}
