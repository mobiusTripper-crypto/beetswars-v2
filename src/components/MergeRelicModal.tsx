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
} from "@chakra-ui/react";
import { useMergeRelic } from "hooks/useMergeRelic";
import { useState } from "react";
import type { ReliquaryFarmPosition } from "services/reliquary";
import { RelicBalance } from "types/theGraph.raw";

interface modalProps {
  // data: Tokendata;
  // lasttokens?: Tokendata[];
  // isNew: boolean;
  // onSubmit: (payload: Tokendata) => void;

  relic: ReliquaryFarmPosition;
  relicPositions: ReliquaryFarmPosition[];
}

export function MergeTokenModal(props: modalProps) {
  const { relic, relicPositions } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [toId, setToId] = useState<string | undefined>(undefined);
  const { merge, isError, mayFail } = useMergeRelic(relic.relicId, toId || "");

  //console.log(relic);
  //console.log(relicPositions);

  const submit = () => {
    console.log("merge ", relic.relicId, toId);
    merge?.();
    onClose();
  };

  const openModal = () => {
    onOpen();
  };

  return (
    <>
      <Button onClick={openModal}>Merge</Button>

      <Modal
        closeOnOverlayClick={false}
        blockScrollOnMount
        isOpen={isOpen}
        onClose={onClose}
        size="lg"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Merge Relic</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <VStack align="left">
                <FormControl isDisabled>
                  <FormLabel>Relic ID</FormLabel>
                  <Input value={relic.relicId || ""} />
                </FormControl>
                <FormControl>
                  <FormLabel>Into Relic {toId}</FormLabel>
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
            <Button disabled={mayFail || !toId} onClick={submit}>
              Merge
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
