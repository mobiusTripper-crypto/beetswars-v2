import type { NextPage } from "next";
import {
  Box,
  Heading,
  Text,
  Progress,
  Grid,
  GridItem,
  Center,
  Select,
  Switch,
} from "@chakra-ui/react";
import { trpc } from "utils/trpc";
import { useGlobalContext } from "contexts/GlobalContext";
import type { CardData } from "types/card.component";
import { useState } from "react";
import type { VotablePool } from "types/votablePools.raw";
import { DashboardGrid } from "components/DashboardGrid";

const Dashboard: NextPage = () => {
  const roundlist = trpc.dashboard.roundlist.useQuery().data?.rounds as number[];
  const { requestedRound } = useGlobalContext();
  const [round, setRound] = useState(requestedRound || 0);
  const [voteindex, setVoteindex] = useState(22);
  const [selected, setSelected] = useState(false);

  const commonData = trpc.dashboard.list.useQuery({ round: round }).data?.board as CardData[];
  const poolData = trpc.dashboard.single.useQuery({ round: round, voteindex }).data
    ?.board as CardData[];
  const poolslist = trpc.dashboard.poolslist.useQuery({ round: round }).data
    ?.pools as VotablePool[];

  const changeVoteindex = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value);
    setVoteindex(parseInt(e.target.value));
  };

  if (!commonData || !poolData)
    return (
      <>
        <Box height="1px">
          <Progress size="xs" isIndeterminate />{" "}
        </Box>
        <Box m={6}>
          <Heading mt={6}>Loading ...</Heading>
          <Text>waiting for data round {round}</Text>
        </Box>
      </>
    );
  return (
    <Center mt={12}>
      <Grid templateColumns="200px 3fr">
        <GridItem w="100%" bg="black">
          <Box m={6}>
            <Select
              onChange={event => setRound(Number(event.target.value))}
              value={round}
              defaultValue={roundlist[1]}
            >
              {roundlist.map((round: number, index: number) => (
                <option key={index} value={round}>
                  Round {round}
                </option>
              ))}
            </Select>
            {/* <RoundSelector handleChange={changeRound} /> */}
            <Text mt={12}>activate single pool data for round {round}</Text>
            <Switch size="lg" isChecked={selected} onChange={() => setSelected(!selected)} m={6} />
            <Select onChange={changeVoteindex} placeholder="Select pool" disabled={!selected}>
              {poolslist &&
                poolslist.map((pool, index) => (
                  <option key={index} value={pool.voteindex}>
                    {pool.poolName}
                  </option>
                ))}
            </Select>
          </Box>
        </GridItem>
        <GridItem w="100%" bg="darkblue">
          {!selected ? (
            <DashboardGrid cardList={commonData} />
          ) : (
            <DashboardGrid cardList={poolData} />
          )}
        </GridItem>
      </Grid>
    </Center>
  );
};

export default Dashboard;
