import { Box, Card, Flex, Heading, Text } from "@chakra-ui/react";
import type { DashboardData } from "types/bribersDashboard.trpc";

interface Props {
  data: DashboardData;
  requestedRound: number;
}

export const DashboardTemp: React.FC<Props> = ({ data, requestedRound }) => {
  return (
    <Flex direction="row" justifyContent="center" alignItems="center">
      <Box p={5}>
        <Flex direction="row" justifyContent="space-between">
          <Card m={6} p={4}>
            <Heading size="md">Beets Emissions</Heading>
            <Text>last day</Text>
            <Text fontSize="xl">{data.beetsEmissionsPerDay.toLocaleString()}</Text>
          </Card>
          <Card m={6} p={4}>
            <Heading size="md">Fantom Blocks</Heading>
            <Text>last day</Text>
            <Text fontSize="xl">{data.fantomBlocksPerDay.toLocaleString()}</Text>
          </Card>
          <Card m={6} p={4}>
            <Heading size="md">Total fBEETS Supply</Heading>
            <Text>up to now</Text>
            <Text fontSize="xl" justifySelf={"end"}>
              {/* //TODO: move to right */}
              {data.totalFbeetsSupply.toLocaleString()}
            </Text>
          </Card>
        </Flex>
        <Flex direction="row" justifyContent="space-between">
          <Card m={6} p={4}>
            <Heading size="md">Beets Emissions for Votes</Heading>
            <Text>
              for Round {requestedRound} {data.payoutStatus !== "settled" ? "estimated" : ""}
            </Text>
            <Text fontSize="xl"> {data.roundBeetsEmissions.toLocaleString()}</Text>
          </Card>
          <Card m={6} p={4}>
            <Heading size="md">Round Emissions Usd</Heading>
            <Text>
              for Round {requestedRound} {data.payoutStatus !== "settled" ? "estimated" : ""}
            </Text>
            <Text fontSize="xl">$ {data.roundEmissionsUsd.toLocaleString()}</Text>
          </Card>
          <Card m={6} p={4}>
            <Heading size="md">Vote Incentives Roi</Heading>
            <Text>
              for Round {requestedRound} {data.payoutStatus !== "settled" ? "estimated" : ""}
            </Text>
            <Text fontSize="xl">{data.voteIncentivesRoi} %</Text>
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
  );
};
