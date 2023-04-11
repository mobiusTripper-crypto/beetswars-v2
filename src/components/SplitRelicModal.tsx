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
import type { EthAddressType } from "types/ethAdress.raw";
import { ModalButton } from "components/ModalButton";

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
  const [amount, setAmount] = useState<BigNumber | undefined>(undefined);

  const { split, isError, mayFail, isSuccess, isEnabled } = useSplitRelic(
    (changeAddressEnabled ? toAddress : account.address) || "",
    relic.relicId,
    amount || BigNumber.from("0")
  );

  const submit = () => {
    setSplitPending(true);
    split?.();
    //onClose();
  };

  const reset = () => {
    setChangeAddressEnabled(false);
    setAmount(undefined);
    setToAddress(account.address);
  };

  const openModal = () => {
    onOpen();
  };

  useEffect(() => {
    if (isSuccess || isError) {
      refresh();
      setSplitPending(false);
      onClose();
    }
  }, [isSuccess, isError]);

  return (
    <>
      <ModalButton text="Split" disabled={parseFloat(relic.amount) === 0} action={openModal} />
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
                </FormControl>
                <FormControl>
                  <Checkbox
                    m={2}
                    isChecked={changeAddressEnabled}
                    onChange={() => setChangeAddressEnabled(!changeAddressEnabled)}
                  >
                    Send to different address
                  </Checkbox>
                  {changeAddressEnabled ? (
                    <>
                      <Input
                        placeholder={account.address}
                        value={toAddress || ""}
                        onChange={event => setToAddress(event.target.value)}
                      />
                      <FormHelperText>
                        Relics sent to the wrong address cannot be recovered. Be absolutely certain
                        the address is entered correctly.
                      </FormHelperText>
                    </>
                  ) : (
                    <>
                      <FormHelperText>
                        The new relic will be created in the current wallet address. Check the box
                        to send to a different wallet address.
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
            <Button disabled={mayFail || !isEnabled || splitPending} onClick={submit}>
              {splitPending ? <Spinner /> : "Split"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
