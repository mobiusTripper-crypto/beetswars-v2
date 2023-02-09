import {
  Button,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
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
  Text,
  Textarea,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { trpc } from "utils/trpc";
import { useState } from "react";
import { Reward } from "./Reward";
import type { Reward as RewardType } from "types/bribedata.raw";

interface modalProps {
  round: number;
  isNew: boolean;
  offerId?: number;
}

export function EditOfferModal(props: modalProps) {
  const { round, isNew, offerId } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const bribedata = trpc.bribes.list_raw.useQuery({ round: round }).data?.bribefile;
  const offerData = bribedata?.bribedata?.find(item => item.offerId === offerId);
  //const tokenData = bribedata?.tokendata;
  const tokens = bribedata?.tokendata.map(t => t.token);

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
  const [rewards, setRewards] = useState(offerData?.reward);

  const openModal = () => {
    if (!isNew && offerData) {
      console.log("set values");
      setVoteIndex(offerData.voteindex);
      setRewardCap(offerData.rewardcap || undefined); //TODO, sometimes this is set to null, the || will make sure it's undefined
      setPayoutThreshold(offerData.payoutthreshold || undefined);
      setPercentageThreshold(offerData.percentagethreshold || undefined);
      setPoolName(offerData.poolname || "");
      setPoolURL(offerData.poolurl || "");
      setDescription(offerData.rewarddescription || "");
      setAssumption(offerData.assumption || "");
      setRewards(offerData?.reward);

      console.log(offerData.rewardcap, rewardCap);
    }

    onOpen();
  };

  const updateReward = (rewardData: RewardType, rewardNumber: number) => {
    const rewardArray = rewards ? [...rewards] : [];
    rewardArray[rewards ? rewards.findIndex(r => r.rewardId === rewardNumber) : 0] = {
      ...rewardData,
    };
    setRewards(rewardArray);
  };

  const maxRewardId =
    rewards?.length === 0
      ? 0
      : rewards?.reduce((prev, current) => (prev.rewardId > current.rewardId ? prev : current))
          .rewardId || 0;

  const defaultReward: RewardType = {
    type: "fixed",
    token: "",
    amount: 0,
    isfixed: true,
    rewardId: maxRewardId + 1,
  };

  const addReward = () => {
    const newRewardData = Object.assign({}, defaultReward);
    setRewards([...(rewards ? rewards : []), newRewardData]);
  };

  const deleteReward = (rewardId: number) => {
    const filteredRewards = rewards?.filter(r => r.rewardId !== rewardId);
    setRewards(filteredRewards);
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
        reward: rewards || [],
        additionalrewards: [],
      },
    };

    if (isNew) {
      addOffer.mutate(data);
    } else {
      console.log("rewardcap", rewardCap);
      console.log("save edit", data);
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
            <Heading size="md" mt={4}>
              Rewards
            </Heading>
            <Grid templateColumns="1fr 3fr 3fr 3fr 2fr 1fr" gap={4} mt={2} alignItems="center">
              <GridItem fontWeight="bold">ID</GridItem>
              <GridItem fontWeight="bold">Type</GridItem>
              <GridItem fontWeight="bold">Token</GridItem>
              <GridItem fontWeight="bold">Amount</GridItem>
              <GridItem fontWeight="bold">Is Fixed</GridItem>
              <GridItem>
                <Button onClick={addReward}>Add</Button>
              </GridItem>
              <>
                {rewards?.map((r, index) => {
                  return (
                    <Reward
                      reward={r}
                      key={index}
                      tokens={tokens || []}
                      updateReward={updateReward}
                      deleteReward={deleteReward}
                    />
                  );
                })}
              </>
            </Grid>
            {/* {offerData?.additionalrewards?.toString()} */}
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
