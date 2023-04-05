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
} from "@chakra-ui/react";
import { useTransferRelic } from "hooks/useTransferRelic";
import { useState } from "react";
import type { ReliquaryFarmPosition } from "services/reliquary";

interface modalProps {
  // data: Tokendata;
  // lasttokens?: Tokendata[];
  // isNew: boolean;
  // onSubmit: (payload: Tokendata) => void;

  relic: ReliquaryFarmPosition;
}

export function TransferTokenModal(props: modalProps) {
  const { relic } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [toAddress, setToAddress] = useState<string | undefined>(undefined);
  const { transfer, isError, mayFail } = useTransferRelic(toAddress || "", relic.relicId || "");

  //const mayFail = false

  const handleChange = (event: any) => {
    event.preventDefault();
    console.log(event.target.value);
    setToAddress(event.target.value);
  };

  const submit = () => {
    console.log("transfer ", toAddress, relic.relicId);
    transfer?.();
    onClose();
  };

  const openModal = () => {
    onOpen();
  };

  return (
    <>
      <Button onClick={openModal}>Transfer</Button>

      <Modal
        closeOnOverlayClick={false}
        blockScrollOnMount
        isOpen={isOpen}
        onClose={onClose}
        size="lg"
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
                    Items sent to the wrong address cannot be recovered. Be certain the address is
                    entered correctly.
                  </FormHelperText>
                </FormControl>
              </VStack>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button disabled={mayFail || !toAddress} onClick={submit}>
              Transfer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
