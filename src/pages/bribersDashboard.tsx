import { Box, Card, Flex, Heading, Text } from "@chakra-ui/react";
import RoundSelector from "components/RoundSelector";
import { useGlobalContext } from "contexts/GlobalContext";
import { trpc } from "utils/trpc";

const Dashboard = () => {
  const { requestedRound } = useGlobalContext();
  const data = trpc.dashboard.list.useQuery({ round: requestedRound }).data?.board;
  if (!data)
    return (
      <Box m={6}>
        <RoundSelector />
        <Heading mt={6}>Error</Heading>
        <Text>no data available for Round {requestedRound}</Text>
      </Box>
    );
  return (
    <>
      <RoundSelector />
      <Flex direction="row" justifyContent="center" alignItems="center">
        <Box p={5}>
          <Flex direction="row" justifyContent="space-between">
            <Card m={6} p={4}>
              <Heading size="md">Beets Emissions</Heading>
              <Text>last day</Text>
              <Text fontSize="xl">{data.beetsEmissionsPerDay}</Text>
            </Card>
            <Card m={6} p={4}>
              <Heading size="md">Fantom Blocks</Heading>
              <Text>last day</Text>
              <Text fontSize="xl">{data.fantomBlocksPerDay}</Text>
            </Card>
            <Card m={6} p={4}>
              <Heading size="md">Total fBEETS Supply</Heading>
              <Text>up to now</Text>
              <Text fontSize="xl" justifySelf={"end"}>
                {data.totalFbeetsSupply}
              </Text>
            </Card>
          </Flex>
          <Flex direction="row" justifyContent="space-between">
            <Card m={6} p={4}>
              <Heading size="md">Beets Emissions for Votes</Heading>
              <Text>
                for Round {requestedRound} {data.payoutStatus !== "settled" ? "estimated" : ""}
              </Text>
              <Text fontSize="xl"> {data.roundBeetsEmissions}</Text>
            </Card>
            <Card m={6} p={4}>
              <Heading size="md">Round Emissions Usd</Heading>
              <Text>for Round {requestedRound}</Text>
              <Text fontSize="xl">$ {data.roundEmissionsUsd}</Text>
            </Card>
            <Card m={6} p={4}>
              <Heading size="md">Vote Incentives Roi</Heading>
              <Text fontSize="xl">{data.voteIncentivesRoi}</Text>
            </Card>
          </Flex>
          <Flex direction="row" justifyContent="space-between">
            <Card m={6} p={4}>
              <Heading size="md">Pools Over Threshold</Heading>
              <Text fontSize="xl">{data.poolsOverThreshold}</Text>
            </Card>
            <Card m={6} p={4}>
              <Heading size="md">Total Relics</Heading>
              <Text fontSize="xl">{data.totalRelics}</Text>
            </Card>
            <Card m={6} p={4}>
              <Heading size="md">Payout Status</Heading>
              <Text fontSize="xl">{data.payoutStatus}</Text>
            </Card>
          </Flex>
        </Box>
      </Flex>
    </>
  );
};

export default Dashboard;
