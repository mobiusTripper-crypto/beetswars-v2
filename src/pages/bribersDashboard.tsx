import type { NextPage } from "next";
import {
  Heading,
  Text,
  Grid,
  GridItem,
  Center,
  Select,
  Switch,
  Card,
  VStack,
} from "@chakra-ui/react";
import { trpc } from "utils/trpc";
import { useGlobalContext } from "contexts/GlobalContext";
import type { CardData } from "types/card.component";
import { useState } from "react";
import type { VotablePool } from "types/votablePools.raw";
import { DashboardGrid } from "components/DashboardGrid";

const Dashboard: NextPage = () => {
  const rounddata = trpc.dashboard.roundlist.useQuery().data;
  const roundlist = rounddata?.rounds ?? [];
  const latest = rounddata?.latest ?? 0;
  const { requestedRound, requestRound } = useGlobalContext();
  const [round, setRound] = useState((requestedRound as number) || latest);
  const [voteindex, setVoteindex] = useState(22);
  const [selected, setSelected] = useState(false);

  const commonData = trpc.dashboard.list.useQuery(
    { round: round },
    { enabled: !!round && !selected }
  ).data?.board as CardData[];
  const poolData = trpc.dashboard.single.useQuery(
    { round: round, voteindex },
    { enabled: !!round && selected }
  ).data?.board as CardData[];
  const poolslist = trpc.dashboard.poolslist.useQuery({ round: round }, { enabled: !!round }).data
    ?.pools as VotablePool[];

  const changeVoteindex = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value);
    setVoteindex(parseInt(e.target.value));
  };

  return (
    <Center mt={12}>
      <VStack>
        <Heading>Bribers Dashboard</Heading>
        <Grid templateColumns="200px 3fr">
          <GridItem w="100%" mt={6} mb={6}>
            <Card p={6} border={1} minHeight="100%">
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
              <Switch
                size="lg"
                isChecked={selected}
                onChange={() => setSelected(!selected)}
                m={6}
              />
              <Select onChange={changeVoteindex} placeholder="Select pool" disabled={!selected}>
                {poolslist &&
                  poolslist.map((pool, index) => (
                    <option key={index} value={pool.voteindex}>
                      {pool.poolName}
                    </option>
                  ))}
              </Select>
            </Card>
          </GridItem>
          <GridItem w="100%">
            {!selected ? (
              <DashboardGrid cardList={commonData} />
            ) : (
              <DashboardGrid cardList={poolData} />
            )}
          </GridItem>
        </Grid>
      </VStack>
    </Center>
  );
};

export default Dashboard;
