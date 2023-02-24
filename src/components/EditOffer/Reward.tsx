import { Button, Checkbox, GridItem, Input, Select, Text } from "@chakra-ui/react";
import type { Reward as RewardType } from "types/bribedata.raw";

interface RewardProps {
  reward: RewardType;
  tokens: string[];
  updateReward: (rewardData: RewardType, rewardId: number) => void;
  deleteReward: (rewardId: number) => void;
}

export function Reward(props: RewardProps) {
  const { reward, tokens, updateReward, deleteReward } = props;
  const selectList = ["", ...tokens]; // for select to always trigger an update

  const handleRewardTypeChange = (value: string) => {
    //TODO: make this type an enum, and make a better enum to string conversion, because this code is terrible
    let xxx: "fixed" | "percent" | "pervote" = "fixed";
    if (value === "percent") xxx = "percent";
    if (value === "pervote") xxx = "pervote";
    const rewardCopy = {
      ...reward,
      ["type"]: xxx,
    };
    updateReward(rewardCopy, reward.rewardId);
  };

  return (
    <>
      <GridItem>{reward.rewardId}</GridItem>
      <GridItem>
        <Select value={reward.type} onChange={e => handleRewardTypeChange(e.target.value)}>
          <option value="fixed">Fixed</option>
          <option value="percent">Percent</option>
          <option value="pervote">Per Vote</option>
        </Select>
      </GridItem>
      <GridItem>
        {reward.isfixed ? (
          <Text>USD value</Text>
        ) : (
          <Select
            value={reward.token}
            onChange={e => {
              const rewardCopy = {
                ...reward,
                ["token"]: e.target.value,
              };
              updateReward(rewardCopy, reward.rewardId);
            }}
          >
            {selectList.map((t, index) => (
              <option key={index} value={t}>
                {t}
              </option>
            ))}
          </Select>
        )}
      </GridItem>
      <GridItem>
        <Input
          type="number"
          value={(reward.amount || "").toString()}
          onChange={e => {
            const newVal = e.target.value;
            const rewardCopy = {
              ...reward,
              ["amount"]: Number(newVal),
            };
            updateReward(rewardCopy, reward.rewardId);
          }}
        />
      </GridItem>
      <GridItem>
        <Checkbox
          isChecked={reward.isfixed}
          onChange={e => {
            const rewardCopy = {
              ...reward,
              ["isfixed"]: e.target.checked,
            };
            updateReward(rewardCopy, reward.rewardId);
          }}
        />
      </GridItem>
      <GridItem>
        <Button onClick={() => deleteReward(reward.rewardId)}>Delete</Button>
      </GridItem>
    </>
  );
}
