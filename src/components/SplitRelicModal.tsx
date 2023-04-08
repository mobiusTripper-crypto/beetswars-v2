import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  VStack,
  Checkbox,
  Spinner,
} from "@chakra-ui/react";
import { useSplitRelic } from "hooks/useSplitRelic";
import { useState, useEffect } from "react";
import type { ReliquaryFarmPosition } from "services/reliquary";
import { useAccount } from "wagmi";
import { BigNumberInput } from "./BigNumberInput";
import { BigNumber } from "ethers";
import { type EthAddressType, EthAddress } from "types/ethAdress.raw";

interface modalProps {
  relic: ReliquaryFarmPosition;
  refresh: () => void;
}

export function SplitTokenModal(props: modalProps) {
  const account = useAccount();
  const { relic, refresh } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [changeAddressEnabled, setChangeAddressEnabled] = useState<boolean>(false);
  const [splitPending, setSplitPending] = useState<boolean>(false);
  const [toAddress, setToAddress] = useState<EthAddressType | undefined>(account.address);
  const [amount, setAmount] = useState<BigNumber>(BigNumber.from(0));
  const { split, isError, mayFail, isSuccess } = useSplitRelic(
    toAddress || "",
    relic.relicId || "",
    amount || ""
  );

  const submit = () => {
    console.log("submit split", toAddress, relic.relicId);
    setSplitPending(true);
    split?.();
    //onClose();
  };

  const reset = () => {
    console.log("reset split", relic.relicId);
    setChangeAddressEnabled(false);
    setAmount(BigNumber.from(0));
    setToAddress(account.address);
  };

  const openModal = () => {
    onOpen();
  };

  /*
  console.log(
    mayFail,
    !amount.gt(0),
    !EthAddress.safeParse(toAddress).success,
    isSplitting,
    splitPending
  );
*/

  useEffect(() => {
    console.log("effect");
    if (isSuccess || isError) {
      console.log("refresh");
      refresh();
      setSplitPending(false);
      onClose();
    }
  }, [isSuccess, isError]);

  return (
    <>
      <Button onClick={openModal}>Split</Button>

      <Modal
        closeOnOverlayClick={false}
        blockScrollOnMount
        isOpen={isOpen}
        onClose={onClose}
        size="lg"
        onCloseComplete={reset}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Split Relic #{relic.relicId || ""}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <VStack align="left">
                <FormControl isDisabled>
                  <FormLabel>Relic ID</FormLabel>
                  <Input value={relic.relicId || ""} />
                </FormControl>
                <FormControl>
                  <FormLabel>Amount (max {relic.amount})</FormLabel>
                  <BigNumberInput
                    placeholder="0"
                    value={amount}
                    onChange={value => setAmount(value.bigNumberValue || BigNumber.from(0))}
                    max={relic.amount}
                  />

                  <Checkbox
                    m={2}
                    isChecked={changeAddressEnabled}
                    onChange={() => setChangeAddressEnabled(!changeAddressEnabled)}
                  >
                    change Target Address
                  </Checkbox>
                  {changeAddressEnabled ? (
                    <>
                      <Input
                        placeholder={account.address}
                        value={toAddress || ""}
                        onChange={event => setToAddress(event.target.value)}
                      />
                      <FormHelperText>
                        Items sent to the wrong address cannot be recovered. Be certain the address
                        is entered correctly.
                      </FormHelperText>
                    </>
                  ) : (
                    <>
                      <FormHelperText>
                        Split relic will be created inside the same wallet, check the Box to send
                        split relic to another Address
                      </FormHelperText>
                    </>
                  )}
                </FormControl>
              </VStack>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose} disabled={splitPending}>
              Cancel
            </Button>
            <Button
              disabled={mayFail || !amount.gt(0) || !EthAddress.safeParse(toAddress).success}
              onClick={submit}
            >
              {splitPending ? <Spinner /> : "Split!"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
