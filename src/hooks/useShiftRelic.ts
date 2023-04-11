import type { UseToastOptions } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import ReliquaryAbi from "utils/abi/Reliquary.json";
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import type { BigNumber } from "ethers";
import { type EthAddressType, EthAddress } from "types/ethAdress.raw";

const RELIC_CONTRACT = "0x1ed6411670c709f4e163854654bd52c74e66d7ec";

const defaultOptions: Partial<UseToastOptions> = {
  duration: 5000,
  isClosable: true,
  position: "bottom-right",
};

const shiftSuccess = (): UseToastOptions => ({
  title: "Shift Successful.",
  description: "Your amount was shifted successfully",
  status: "success",
  ...defaultOptions,
});

const shiftFailure = (): UseToastOptions => ({
  title: "Shift Failed.",
  description: "The shift operation has failed",
  status: "error",
  ...defaultOptions,
});

export function useShiftRelic(fromId: string, toId: string, amount: BigNumber) {
  const toast = useToast();

  const isEnabled = !!Number(fromId) && !!Number(toId) && amount.gt(0);

    console.log( [Number(fromId), Number(toId)], amount,)

  const { config, isError: mayFail } = usePrepareContractWrite({
    address: RELIC_CONTRACT,
    abi: ReliquaryAbi,
    functionName: "shift",
    args: [Number(fromId), Number(toId), amount],
    enabled: isEnabled,
  });

  const { write, isError, data } = useContractWrite({
    onError: () => toast(shiftFailure()),
    ...config,
  });

  const { isSuccess, isLoading } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: () => toast(shiftSuccess()),
    onError(e) {
      console.error(e);
      toast(shiftFailure());
    },
  });

  return {
    shift: write,
    isShifting: isLoading,
    isSuccess,
    isError,
    mayFail,
    isEnabled,
  };
}
