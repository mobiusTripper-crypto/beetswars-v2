import {
  Button,
  FormControl,
  Text,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  useDisclosure,
  VStack,
  Spinner,
} from "@chakra-ui/react";
import { useShiftRelic } from "hooks/useShiftRelic";
import { useEffect, useState } from "react";
import type { ReliquaryFarmPosition } from "services/reliquary";
import { BigNumberInput } from "./BigNumberInput";
import { BigNumber } from "ethers";
import { ModalButton } from "components/ModalButton";

interface modalProps {
  relic: ReliquaryFarmPosition;
  relicPositions: ReliquaryFarmPosition[];
  refresh: () => void;
}

export function ShiftTokenModal(props: modalProps) {
  const { relic, relicPositions, refresh } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [shiftPending, setShiftPending] = useState<boolean>(false);
  const [toId, setToId] = useState<string | undefined>(undefined);
  const [amount, setAmount] = useState<BigNumber | undefined>(undefined);

  const { shift, isError, mayFail, isSuccess, isEnabled } = useShiftRelic(
    relic.relicId,
    toId || "",
    amount || BigNumber.from("0")
  );

  const submit = () => {
    console.log("merge ", relic.relicId, toId);
    shift?.();
    setShiftPending(true);
    //onClose();
  };

  const reset = () => {
    console.log("reset shift", relic.relicId);
    setToId(undefined);
    setAmount(undefined);
  };

  const openModal = () => {
    onOpen();
  };

  useEffect(() => {
    console.log("effect", isSuccess, isError);
    if (isSuccess || isError) {
      console.log("refresh");
      refresh();
      setShiftPending(false);
      onClose();
    }
  }, [isSuccess, isError]);

  return (
    <>
      <ModalButton text="Shift" disabled={(relicPositions.length < 2 || parseFloat(relic.amount) === 0)} action={openModal} />

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
          <ModalHeader>Shift Relic</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <VStack align="left">
                <FormControl isDisabled>
                  <FormLabel>From Relic ID</FormLabel>
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
                  <FormLabel>To Relic {toId}</FormLabel>
                  <Select placeholder="Select Target Relic" onChange={e => setToId(e.target.value)}>
                    {relicPositions.map((rel, index) => {
                      if (rel.relicId !== relic.relicId) {
                        return (
                          <option key={index} value={rel.relicId}>
                            {rel.relicId}
                          </option>
                        );
                      }
                    })}
                  </Select>
                  <Text mt={2}>
                    Shift amount from {relic.relicId} to {toId}
                  </Text>
                </FormControl>
              </VStack>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose} disabled={shiftPending}>
              Cancel
            </Button>
            <Button disabled={mayFail || !isEnabled || shiftPending} onClick={submit}>
              {shiftPending ? <Spinner /> : "Shift"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}


