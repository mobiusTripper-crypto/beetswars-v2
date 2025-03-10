import type { NextPage } from "next";
import {
  Heading,
  Text,
  Select,
  Switch,
  Card,
  VStack,
  // Button,
  useColorModeValue,
  Container,
  Flex,
  Box,
  Progress,
} from "@chakra-ui/react";
import { trpc } from "utils/trpc";
import { useGlobalContext } from "contexts/GlobalContext";
import type { CardData } from "types/card.component";
import { useEffect, useState } from "react";
import type { VotablePool } from "types/votablePools.raw";
import { DashboardGrid } from "components/DashboardGrid";

const Dashboard: NextPage = () => {
  const bgCard = useColorModeValue("#D5E0EC", "#1C2635");

  // const latest = trpc.dashboard.roundlist.useQuery().data?.latest ?? 0;
  const { requestedRound } = useGlobalContext();
  const [round, setRound] = useState(requestedRound as number);
  const [voteindex, setVoteindex] = useState(22);
  const [selected, setSelected] = useState(false);
  // const [future, setFuture] = useState(false);

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
    if (!requestedRound) return;
    setRound(requestedRound);
  }, [requestedRound, voteindex]);
  // }, [requestedRound, voteindex, future, latest]);
  // const futureButtonHandler = () => {
  //   setSelected(false);
  //   setFuture(!future);
  // };

  return (

    <Container maxW="container.xl" centerContent>
      <VStack align="center">
        <Text
          fontSize={["sm", "xl", "3xl", "4xl", "5xl"]}
          fontWeight="600"
          margin="20px"
          textAlign="center"
        >
          Bribers Dashboard
        </Text>
        <Flex justifyContent="center" p={6} gap={6} flexDir={["column", null, null, "row"]}>
          <Card
            p={6}
            border="1px"
            minH="100%"
            w={["300px", null, "616px", "200px"]}
            alignItems="center"
            backgroundColor={bgCard}
            borderRadius={20}
          >
            <Heading as="h3" size="md" mt={6}>
              Round {requestedRound}
            </Heading>
            <Text mt={12} alignItems="center">
              activate single pool data for round {requestedRound}
            </Text>
            <Switch
              size="lg"
              isChecked={selected}
              onChange={() => setSelected(!selected)}
              m={6}
              // disabled={future}
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
            {/* <Button mt={12} border="1px" onClick={futureButtonHandler}>
              {future ? "show current" : "show prediction"}
            </Button> */}
          </Card>
          <Box>
            {!commonData || (selected && !poolData) ? (
              <Box w={["300px", null, "616px", null, "932px"]} mr={6}>
                <Progress size="xs" isIndeterminate />
              </Box>
            ) : !selected ? (
              <DashboardGrid cardList={commonData} />
            ) : (
              <DashboardGrid cardList={poolData} />
            )}
          </Box>
        </Flex>
      </VStack>
    </Container>
  );
};

export default Dashboard;
