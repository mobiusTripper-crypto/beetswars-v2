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
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { trpc } from "utils/trpc";
import { useGlobalContext } from "contexts/GlobalContext";
import type { CardData } from "types/card.component";
import { useEffect, useState } from "react";
import type { VotablePool } from "types/votablePools.raw";
import { DashboardGrid } from "components/DashboardGrid";

const Dashboard: NextPage = () => {
  const bgCard = useColorModeValue("#D5E0EC", "#1C2635");

  const latest = trpc.dashboard.roundlist.useQuery().data?.latest ?? 0;
  const { requestedRound } = useGlobalContext();
  const [round, setRound] = useState(requestedRound as number);
  const [voteindex, setVoteindex] = useState(22);
  const [selected, setSelected] = useState(false);
  const [future, setFuture] = useState(false);

  const commonData = trpc.dashboard.list.useQuery(
    { round: round || 0 },
    { enabled: !!requestedRound && !selected }
  ).data?.board as CardData[];
  const poolData = trpc.dashboard.single.useQuery(
    { round: round || 0, voteindex },
    { enabled: !!requestedRound && selected }
  ).data?.board as CardData[];
  const poolslist = trpc.dashboard.poolslist.useQuery(
    { round: round || 0 },
    { enabled: !!requestedRound }
  ).data?.pools as VotablePool[];

  useEffect(() => {
    if (!requestedRound || !latest) return;
    setRound(future ? latest + 1 : requestedRound);
  }, [requestedRound, voteindex, future, latest]);
  const futureButtonHandler = () => {
    setSelected(false);
    setFuture(!future);
  };

  return (
    <Center mt={12}>
      <VStack>
        <Heading>Bribers Dashboard</Heading>
        <Grid templateColumns="200px 1fr">
          <GridItem w="100%" mt={6} mb={6}>
            <Card p={6} border="1px" minHeight="100%" alignItems="center" backgroundColor={bgCard}>
              <Heading as="h3" size="md" mt={6}>
                {future ? "future prediction" : `Round ${requestedRound}`}
              </Heading>
              {/* <RoundSelector handleChange={e => requestRound(parseInt(e.target.value))} /> */}
              <Text mt={12} alignItems="center">
                activate single pool data for round {requestedRound}
              </Text>
              <Switch
                size="lg"
                isChecked={selected}
                onChange={() => setSelected(!selected)}
                m={6}
                disabled={future}
              />
              <Select
                onChange={e => setVoteindex(parseInt(e.target.value))}
                placeholder="Select pool"
                disabled={!selected}
              >
                {poolslist &&
                  poolslist.map((pool, index) => (
                    <option key={index} value={pool.voteindex}>
                      {pool.poolName}
                    </option>
                  ))}
              </Select>
              <Button mt={12} onClick={futureButtonHandler}>
                {future ? "show current" : "show prediction"}
              </Button>
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
