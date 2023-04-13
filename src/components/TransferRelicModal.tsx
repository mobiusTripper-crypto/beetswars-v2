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
  Spinner,
} from "@chakra-ui/react";
import { useTransferRelic } from "hooks/useTransferRelic";
import { useState, useEffect, type SetStateAction } from "react";
import type { ReliquaryFarmPosition } from "services/reliquary";
import type { EthAddressType } from "types/ethAdress.raw";
import { ModalButton } from "components/ModalButton";

interface modalProps {
  relic: ReliquaryFarmPosition;
  refresh: () => void;
}

export function TransferTokenModal(props: modalProps) {
  const { relic, refresh } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [transferPending, setTransferPending] = useState<boolean>(false);
  const [toAddress, setToAddress] = useState<EthAddressType | undefined>(undefined);
  const { transfer, isError, mayFail, isSuccess, isEnabled } = useTransferRelic(
    toAddress || "",
    relic.relicId || ""
  );

  const handleChange = (event: {
    preventDefault: () => void;
    target: { value: SetStateAction<string | undefined> };
  }) => {
    event.preventDefault();
    console.log(event.target.value);
    setToAddress(event.target.value);
  };

  const submit = () => {
    console.log("transfer ", toAddress, relic.relicId);
    setTransferPending(true);
    transfer?.();
    //onClose();
  };

  const reset = () => {
    console.log("reset transfer", relic.relicId);
    setToAddress(undefined);
  };

  const openModal = () => {
    onOpen();
  };

  useEffect(() => {
    console.log("effect");
    if (isSuccess || isError) {
      console.log("refresh");
      refresh();
      setTransferPending(false);
      onClose();
    }
  }, [isSuccess, isError]);

  return (
    <>
      <ModalButton text="Transfer" disabled={false} action={openModal} />
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
          <ModalHeader>Transfer Relic</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <VStack align="left">
                <FormControl isDisabled>
                  <FormLabel>Relic ID</FormLabel>
                  <Input value={relic.relicId || ""} />
                </FormControl>
                <FormControl>
                  <FormLabel>To Address</FormLabel>
                  <Input placeholder="0x..." value={toAddress || ""} onChange={handleChange} />
                  <FormHelperText>
                    Relics sent to the wrong address cannot be recovered. Be absolutely certain the
                    address is entered correctly.
                  </FormHelperText>
                </FormControl>
              </VStack>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose} disabled={transferPending}>
              Cancel
            </Button>
            <Button disabled={mayFail || !isEnabled || transferPending} onClick={submit}>
              {transferPending ? <Spinner /> : "Transfer"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
