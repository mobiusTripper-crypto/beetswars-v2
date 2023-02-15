import { Card, Center, Flex, Text } from "@chakra-ui/react";
import type { BribeHeader } from "types/bribelist.trpc";

interface SummaryProps {
  headerData: BribeHeader;
}

export const Summary = (props: SummaryProps) => {
  const { headerData } = props;

  const dateFormatOptions: Intl.DateTimeFormatOptions = {
    year: "2-digit",
    month: "short",
    day: "2-digit",
    hour: "numeric",
    minute: "numeric",
    timeZoneName: "shortOffset",
    hour12: false,
  };

  console.log("headerData", headerData);
  return (
    <Center>
      <Flex align="center" justify="center" wrap="wrap" gap={4}>
        <Card p={3} align="center">
          <Text>
            Vote Start:{" "}
            {new Intl.DateTimeFormat("en-GB", dateFormatOptions).format(
              new Date(headerData.voteStart)
            )}
          </Text>
          <Text>
            Vote End:{" "}
            {new Intl.DateTimeFormat("en-GB", dateFormatOptions).format(
              new Date(headerData.voteEnd)
            )}
          </Text>
          <Text>Time Left: {headerData.timeRemaining}</Text>
        </Card>
        <Card p={3} align="center">
          <Text>Votes Total: {headerData.totalVotes.toLocaleString("en-us")}</Text>
          <Text>On Incentivized Pools: {headerData.bribedVotes.toLocaleString("en-us")}</Text>
          <Text>Total Voter: {headerData.totalVoter}</Text>
        </Card>
        <Card p={3} align="center">
          <Text>Total Incentives: {headerData.totalBribes.toLocaleString("en-us")}</Text>
          <Text>avg $/1kVP: {headerData.avgPer1000}</Text>
          <Text>Bribed Voter: {headerData.bribedVoter}</Text>
        </Card>
      </Flex>
    </Center>
  );
};
