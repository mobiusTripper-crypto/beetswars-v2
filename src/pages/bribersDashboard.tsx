import type { NextPage } from "next";
import {
  Box,
  Heading,
  Text,
  Progress,
  Grid,
  GridItem,
  Center,
  RadioGroup,
  VStack,
  Radio,
  Select,
} from "@chakra-ui/react";
import { trpc } from "utils/trpc";
import { useGlobalContext } from "contexts/GlobalContext";
import RoundSelector from "components/RoundSelector";
import type { CardData } from "types/card.component";
import { useState } from "react";
import type { VotablePool } from "types/votablePools.raw";
import { DashboardGrid } from "components/DashboardGrid";

const Dashboard: NextPage = () => {
  const { requestedRound, requestRound } = useGlobalContext();
  // const [round, setround] = useState(0);
  const [voteindex, setvoteindex] = useState(22);
  const [option, setoption] = useState("1");

  // const data = trpc.dashboard.list.useQuery({ round: requestedRound }).data?.board as DashboardData;
  const commonData = trpc.dashboard.list.useQuery({ round: requestedRound }).data
    ?.board as CardData[];
  const poolData = trpc.dashboard.single.useQuery({ round: requestedRound, voteindex }).data
    ?.board as CardData[];
  // const roundlist = trpc.dashboard.roundlist.useQuery().data?.rounds as number[];
  const poolslist = trpc.dashboard.poolslist.useQuery({ round: requestedRound }).data
    ?.pools as VotablePool[];

  const changeRound = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value);
    requestRound(parseInt(e.target.value));
  };
  const changeVoteindex = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value);
    setvoteindex(parseInt(e.target.value));
  };

  if (!commonData || !poolData)
    return (
      <>
        <Box height="1px">
          <Progress size="xs" isIndeterminate />{" "}
        </Box>
        <Box m={6}>
          <Heading mt={6}>Loading ...</Heading>
          <Text>waiting for data round {requestedRound}</Text>
        </Box>
      </>
    );
  return (
    <Center mt={12}>
      <Grid templateColumns="200px 3fr">
        <GridItem w="100%" bg="black">
          <Box m={6}>
            {/* <Select onChange={changeRound} value={round}>
              {roundlist.map((round: number, index: number) => (
                <option key={index} value={round}>
                  Round {round}
                </option>
              ))}
            </Select> */}
            <RoundSelector handleChange={changeRound} />
            <Text>{requestedRound}</Text>
            <RadioGroup onChange={setoption} value={option}>
              <VStack>
                <Radio value="1">Overall statistics</Radio>
                <Radio value="2">Select single pool</Radio>
              </VStack>
            </RadioGroup>
            {/* <Text>{JSON.stringify(poolslist)}</Text> */}
            <Select onChange={changeVoteindex} value={voteindex}>
              {poolslist.map((pool, index) => (
                <option key={index} value={pool.voteindex}>
                  {pool.poolName}
                </option>
              ))}
            </Select>
          </Box>
        </GridItem>
        <GridItem w="100%" bg="darkblue">
          {/* Option 1 */}
          {/* <DashboardGrid cardList={commonData} /> */}
          {/* Option 2 */}
          <DashboardGrid cardList={poolData} />
        </GridItem>
      </Grid>
    </Center>
  );
};

export default Dashboard;
