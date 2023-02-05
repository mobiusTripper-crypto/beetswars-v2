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
import { trpc } from "utils/trpc";
import { useState } from "react";

interface modalProps {
  roundNumber?: number;
  isNew: boolean;
  refresh: (round: string) => void;
}

export function EditRoundModal(props: modalProps) {
  const { roundNumber, isNew, refresh } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const editRound = trpc.bribes.editRound.useMutation();
  const addRound = trpc.bribes.addRound.useMutation();
  const [description, setDescription] = useState("");
  const [snapshotID, setSnapshotID] = useState("");
  const [round, setRound] = useState("");
  const bribedata = trpc.bribes.list_raw.useQuery({ round: roundNumber }).data?.bribefile;

  const someFunc = () => {
    if (!isNew) {
      setDescription(bribedata?.description || "");
      setSnapshotID(bribedata?.snapshot || "");
      setRound(bribedata?.round.toString() || "");
    }
    onOpen();
  };

  const save = () => {
    if (isNew) {
      const bribefile = {
        version: round + ".0.0",
        snapshot: snapshotID,
        description: description,
        round: Number(round),
        tokendata: [],
        bribedata: [],
      };
      addRound.mutate(bribefile);
      refresh(round);
    } else if (bribedata) {
      editRound.mutate({ ...bribedata, description: description });
      refresh(bribedata.round.toString());
    }
    onClose();
  };

  return (
    <>
      <Button onClick={someFunc}>{isNew ? "Add New Round" : "Edit Round"}</Button>

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
                  <Input value={bribedata?.version} />
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
                    value={snapshotID}
                    onChange={e => setSnapshotID(e.target.value)}
                  />
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
