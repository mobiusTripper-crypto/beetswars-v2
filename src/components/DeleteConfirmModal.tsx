import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Text,
} from "@chakra-ui/react";
import { trpc } from "utils/trpc";

interface modalProps {
  round: number;
  offerId: number;
}

export function DeleteConfrimModal(props: modalProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { round, offerId } = props;
  const deleteOffer = trpc.bribes.deleteOffer.useMutation();

  const openModal = () => {
    onOpen();
  };

  return (
    <>
      <Button onClick={openModal}>Delete Offer</Button>

      <Modal closeOnOverlayClick={false} blockScrollOnMount isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Round</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Delete offer number: {offerId}?</Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                deleteOffer.mutate({ round, offerId });
                onClose();
              }}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
