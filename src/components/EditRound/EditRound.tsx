import {
  Button,
  FormControl,
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
import { useState } from "react";
import type { Bribefile } from "types/bribedata.raw";

interface modalProps {
  roundNumber?: number;
  data: Bribefile;
  isNew: boolean;
  onSubmit: (payload: Bribefile) => void;
}

export function EditRoundModal(props: modalProps) {
  const { roundNumber, data, isNew, onSubmit } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [description, setDescription] = useState(data.description);
  const [snapshotId, setSnapshotId] = useState(data.snapshot);
  const [round, setRound] = useState(roundNumber?.toString() || "");
  const [emission, setEmission] = useState(data.emission?.toString() || "");

  const save = () => {
    const payload = {
      version: isNew ? round + ".0.0" : data.version,
      snapshot: snapshotId,
      description: description,
      round: Number(round),
      emission: Number(emission),
      tokendata: isNew ? [] : data.tokendata,
      bribedata: isNew ? [] : data.bribedata,
    };
    onSubmit(payload);
    onClose();
  };

  return (
    <>
      <Button onClick={onOpen}>{isNew ? "Add New Round" : "Edit Round"}</Button>

      <Modal closeOnOverlayClick={false} blockScrollOnMount isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Round</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <VStack align="left">
                <FormControl isDisabled>
                  <FormLabel>Version</FormLabel>
                  <Input value={data.version} />
                </FormControl>
                <FormControl isDisabled={!isNew}>
                  <FormLabel>Round</FormLabel>
                  <Input value={round} onChange={e => setRound(e.target.value)} />
                </FormControl>
                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Input value={description} onChange={e => setDescription(e.target.value)} />
                </FormControl>
                <FormControl>
                  <FormLabel>Snapshot ID</FormLabel>
                  <Input
                    placeholder="0x..."
                    value={snapshotId}
                    onChange={e => setSnapshotId(e.target.value)}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Emission</FormLabel>
                  <Input value={emission} onChange={e => setEmission(e.target.value)} />
                </FormControl>
              </VStack>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={save}>Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
