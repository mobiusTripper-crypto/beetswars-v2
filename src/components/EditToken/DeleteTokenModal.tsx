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
import { useQueryClient } from "@tanstack/react-query";
import { trpc } from "utils/trpc";

interface modalProps {
  round: number;
  tokenId: number;
}

export function DeleteTokenModal(props: modalProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { round, tokenId } = props;
  const queryClient = useQueryClient();

  const deleteToken = trpc.bribes.deleteToken.useMutation({
    onSuccess: () => queryClient.invalidateQueries(),
  });

  return (
    <>
      <Button onClick={onOpen}>Delete</Button>

      <Modal closeOnOverlayClick={false} blockScrollOnMount isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Token</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Delete token number: {tokenId}?</Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                deleteToken.mutate({ round, tokenId });
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
