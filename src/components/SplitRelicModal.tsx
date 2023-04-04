import {
  Button,
  Checkbox,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
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
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
} from "@chakra-ui/react";
import { useSplitRelic } from "hooks/useSplitRelic";
import { useState } from "react";
import type { ReliquaryFarmPosition } from "services/reliquary";
import { useAccount } from "wagmi";

interface modalProps {
  // data: Tokendata;
  // lasttokens?: Tokendata[];
  // isNew: boolean;
  // onSubmit: (payload: Tokendata) => void;

  relic: ReliquaryFarmPosition;
}

export function SplitTokenModal(props: modalProps) {
  const account = useAccount();

  const { relic } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [toAddress, setToAddress] = useState<string | undefined>(account.address);
  const [amount, setAmount] = useState<string | undefined>(undefined);
  const { split, isError, mayFail } = useSplitRelic(
    toAddress || "",
    relic.relicId || "",
    amount || ""
  );

  const handleChange = (event:any) => {
    event.preventDefault();
    console.log(event.target.value);
    setToAddress(event.target.value);
  };
  const handleAmount = (event:any) => {
    event.preventDefault();
    console.log(event.target.value);
    setAmount(event.target.value);
  };

  const submit = () => {
    console.log("split ", toAddress, relic.relicId);
    split?.();
    onClose();
  };

  const openModal = () => {
    onOpen();
  };

  return (
    <>
      <Button onClick={openModal}>Split</Button>

      <Modal
        closeOnOverlayClick={false}
        blockScrollOnMount
        isOpen={isOpen}
        onClose={onClose}
        size="lg"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Split Relic</ModalHeader>
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
                  <Input
                    placeholder="0"
                    value={amount}
                    onChange={handleAmount}
                    type="number"
                    max={relic.amount}
                  />
                  <FormLabel>To Address</FormLabel>
                  <Input
                    placeholder={account.address}
                    value={toAddress || ""}
                    onChange={handleChange}
                  />
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
            <Button
              disabled={mayFail || !toAddress || !!amount}
              onClick={submit}
            >
              Split
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
