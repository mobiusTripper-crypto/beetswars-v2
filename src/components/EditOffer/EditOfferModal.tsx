import {
  Button,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
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
} from "@chakra-ui/react";
// import { trpc } from "utils/trpc";
import { useState } from "react";
import { Reward } from "./Reward";
import type { Bribedata, Reward as RewardType } from "types/bribedata.raw";

interface modalProps {
  roundNo: number;
  isNew: boolean;
  data: Bribedata;
  tokens: string[];
  onSubmit: (payload: Bribedata) => void;
}

export function EditOfferModal(props: modalProps) {
  const { roundNo, isNew, data, tokens, onSubmit } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [voteIndex, setVoteIndex] = useState(data.voteindex);
  const [poolName, setPoolName] = useState(data.poolname);
  const [poolURL, setPoolURL] = useState(data.poolurl);
  const [description, setDescription] = useState(data.rewarddescription);
  const [assumption, setAssumption] = useState(data.assumption);
  const [percentageThreshold, setPercentageThreshold] = useState(data.percentagethreshold);
  const [rewardCap, setRewardCap] = useState(data.rewardcap);
  const [rewards, setRewards] = useState(data.reward);
  const [payoutThreshold, setPayoutThreshold] = useState(data.payoutthreshold);
  const [offerId] = useState(data.offerId);

  const updateReward = (rewardData: RewardType, rewardNumber: number) => {
    const rewardArray = rewards ? [...rewards] : [];
    rewardArray[rewards ? rewards.findIndex(r => r.rewardId === rewardNumber) : 0] = {
      ...rewardData,
    };
    setRewards(rewardArray);
  };

  const maxRewardId = rewards.reduce(
    (prev, current) => (prev.rewardId > current.rewardId ? prev : current),
    {
      rewardId: 0,
    }
  ).rewardId;

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
    const payload = {
      offerId: offerId || 0,
      voteindex: voteIndex,
      poolname: poolName,
      poolurl: poolURL,
      rewarddescription: description,
      assumption: assumption || undefined,
      percentagethreshold: percentageThreshold || undefined,
      rewardcap: rewardCap || undefined,
      payoutthreshold: payoutThreshold || undefined,
      reward: rewards || [],
      additionalrewards: [] || undefined,
    };

    onSubmit(payload);
    onClose();
  };

  return (
    <>
      <Button onClick={onOpen}>{isNew ? "Add New Offer" : "Edit"}</Button>

      <Modal
        size="4xl"
        closeOnOverlayClick={false}
        blockScrollOnMount
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Offer</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid templateColumns="1fr 1fr" gap={4}>
              <GridItem>
                <FormControl isDisabled>
                  <FormLabel>Round</FormLabel>
                  <Input value={roundNo} />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl isDisabled>
                  <FormLabel>Offer ID</FormLabel>
                  <Input value={data?.offerId} />
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
                  <FormLabel>Payout Threshold (-1 to disable 0.15% cap)</FormLabel>
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
