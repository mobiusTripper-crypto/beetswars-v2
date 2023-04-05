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
} from "@chakra-ui/react";
import { useMergeRelic } from "hooks/useMergeRelic";
import { useEffect, useState } from "react";
import type { ReliquaryFarmPosition } from "services/reliquary";

interface modalProps {
  relic: ReliquaryFarmPosition;
  relicPositions: ReliquaryFarmPosition[];
}

export function MergeTokenModal(props: modalProps) {
  const { relic, relicPositions } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [toId, setToId] = useState<string | undefined>(undefined);
  const { merge, isError, mayFail } = useMergeRelic(relic.relicId, toId || "");

  const [newEntry, setNewEntry] = useState(0);

  useEffect(() => {
    if (!toId) {
      setNewEntry(relic.entry);
    } else {
      const mergeRelic = relicPositions.find(x => x.relicId === toId);
      mergeRelic &&
        setNewEntry(
          (parseFloat(relic.amount) * relic.entry +
            parseFloat(mergeRelic.amount) * mergeRelic.entry) /
            (parseFloat(relic.amount) + parseFloat(mergeRelic.amount))
        );
    }
  }, [relic, relicPositions, toId]);

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
      <Button disabled={relicPositions.length < 2} onClick={openModal}>
        Merge
      </Button>

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
                  <Text mt={2}>
                    Your merged relic will have the new entry date of{" "}
                    {new Date((newEntry || 0) * 1000).toDateString()} and the level of{" "}
                    {Math.min(Math.ceil((Date.now() / 1000 - newEntry) / (7 * 24 * 60 * 60)), 11)}.
                  </Text>
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
