import {
  Button,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { trpc } from "utils/trpc";
import { useState } from "react";

interface modalProps {
  round: number;
  isNew: boolean;
  offerId?: number;
}

export function EditOfferModal(props: modalProps) {
  const { round, isNew, offerId } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const addOffer = trpc.bribes.addOffer.useMutation();
  const editOffer = trpc.bribes.editOffer.useMutation();
  const [rewardCap, setRewardCap] = useState<number | undefined>(undefined);
  const [voteIndex, setVoteIndex] = useState(0);
  const [payoutThreshold, setPayoutThreshold] = useState<number | undefined>(undefined);
  const [percentageThreshold, setPercentageThreshold] = useState<number | undefined>(undefined);
  const [poolName, setPoolName] = useState("");
  const [poolURL, setPoolURL] = useState("");
  const [description, setDescription] = useState("");
  const [assumption, setAssumption] = useState("");
  const bribedata = trpc.bribes.list_raw.useQuery({ round: round }).data?.bribefile;
  const offerData = bribedata?.bribedata?.find(item => item.offerId === offerId);

  const openModal = () => {
    if (!isNew && offerData) {
      setVoteIndex(offerData.voteindex);
      setRewardCap(offerData.rewardcap);
      setPayoutThreshold(offerData.payoutthreshold);
      setPercentageThreshold(offerData.percentagethreshold);
      setPoolName(offerData.poolname);
      setPoolURL(offerData.poolurl);
      setDescription(offerData.rewarddescription);
      setAssumption(offerData.assumption || "");
    }

    onOpen();
  };

  const save = () => {
    const data = {
      round: round,
      payload: {
        offerId: offerId || 0,
        voteindex: voteIndex,
        poolname: poolName,
        poolurl: poolURL,
        rewarddescription: description,
        assumption: assumption,
        percentagethreshold: percentageThreshold,
        rewardcap: rewardCap,
        payoutthreshold: payoutThreshold,
        reward: [],
        additionalrewards: [],
      },
    };

    if (isNew) {
      // const bribefile = {
      //   version: round + ".0.0",
      //   snapshot: snapshotID,
      //   description: description,
      //   round: Number(round),
      //   tokendata: [],
      //   bribedata: [],
      // };
      addOffer.mutate(data);
    } else {
      editOffer.mutate(data);
    }
    onClose();
  };

  return (
    <>
      <Button onClick={openModal}>{isNew ? "Add New Offer" : "Edit"}</Button>

      <Modal
        size="4xl"
        closeOnOverlayClick={false}
        blockScrollOnMount
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Round</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid templateColumns="1fr 1fr" gap={4}>
              <GridItem>
                <FormControl isDisabled>
                  <FormLabel>Round</FormLabel>
                  <Input value={bribedata?.round} />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl isDisabled>
                  <FormLabel>Offer ID</FormLabel>
                  <Input value={offerData?.offerId} />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>Vote Index</FormLabel>
                  <Input
                    value={voteIndex}
                    onChange={e => setVoteIndex(Number(e.target.value))}
                    type="number"
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>Reward Cap</FormLabel>
                  <Input
                    value={rewardCap}
                    onChange={e => setRewardCap(Number(e.target.value))}
                    type="number"
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>Payout Threshold</FormLabel>
                  <Input
                    value={payoutThreshold}
                    onChange={e => setPayoutThreshold(Number(e.target.value))}
                    type="number"
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>Percentage Threshhold</FormLabel>
                  <Input
                    value={percentageThreshold}
                    onChange={e => setPercentageThreshold(Number(e.target.value))}
                    type="number"
                  />
                </FormControl>
              </GridItem>
              <GridItem colSpan={2}>
                <FormControl>
                  <FormLabel>Pool Name</FormLabel>
                  <Input value={poolName} onChange={e => setPoolName(e.target.value)} />
                </FormControl>
              </GridItem>
              <GridItem colSpan={2}>
                <FormControl>
                  <FormLabel>Pool URL</FormLabel>
                  <Input value={poolURL} onChange={e => setPoolURL(e.target.value)} />
                </FormControl>
              </GridItem>
              <GridItem colSpan={2}>
                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Textarea value={description} onChange={e => setDescription(e.target.value)} />
                </FormControl>
              </GridItem>
              <GridItem colSpan={2}>
                <FormControl>
                  <FormLabel>Assumptions</FormLabel>
                  <Textarea value={assumption} onChange={e => setAssumption(e.target.value)} />
                </FormControl>
              </GridItem>
            </Grid>
            {offerData?.reward.toString()}
            {offerData?.additionalrewards?.toString()}
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
