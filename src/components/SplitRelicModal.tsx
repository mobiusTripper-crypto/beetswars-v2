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
import { useSplitRelic } from "hooks/useSplitRelic";
import { useState } from "react";
import type { ReliquaryFarmPosition } from "services/reliquary";
import { useAccount } from "wagmi";
import { BigNumberInput } from "./BigNumberInput";
import { BigNumber } from "ethers";

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
  const [amount, setAmount] = useState<BigNumber>(BigNumber.from(0));
  const { split, isError, mayFail } = useSplitRelic(
    toAddress || "",
    relic.relicId || "",
    amount || ""
  );

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
                  <BigNumberInput
                    placeholder="0"
                    value={amount}
                    onChange={value => setAmount(value.bigNumberValue || BigNumber.from(0))}
                    max={relic.amount}
                  />
                  <FormLabel>To Address</FormLabel>
                  <Input
                    placeholder={account.address}
                    value={toAddress || ""}
                    onChange={event => setToAddress(event.target.value)}
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
            <Button disabled={mayFail || !amount} onClick={submit}>
              Split
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
