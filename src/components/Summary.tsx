import { Card, Text, useColorModeValue, Wrap } from "@chakra-ui/react";
import type { BribeHeader } from "types/bribelist.trpc";

interface SummaryProps {
  headerData: BribeHeader;
}

export const Summary = (props: SummaryProps) => {
  const { headerData } = props;

  const bgCard = useColorModeValue("#D5E0EC", "#1C2635");

  const dateFormatOptions: Intl.DateTimeFormatOptions = {
    year: "2-digit",
    month: "short",
    day: "2-digit",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  };

  return (
    <Wrap justify="center" spacing={10}>
      <Card p={3} backgroundColor={bgCard} align="center">
        <Text>
          Vote Start:{" "}
          {new Intl.DateTimeFormat(undefined, dateFormatOptions).format(
            new Date(headerData.voteStart)
          )}
        </Text>
        <Text>
          Vote End:{" "}
          {new Intl.DateTimeFormat(undefined, dateFormatOptions).format(
            new Date(headerData.voteEnd)
          )}
        </Text>
        <Text fontSize="11px">(your local time)</Text>
        <Text>Time Left: {headerData.timeRemaining}</Text>
      </Card>
      <Card p={3} backgroundColor={bgCard} align="center">
        <Text>Votes Total: {headerData.totalVotes.toLocaleString()}</Text>
        <Text>On Incentivized Pools: {headerData.bribedVotes.toLocaleString()}</Text>
        <Text>Total Voter: {headerData.totalVoter}</Text>
      </Card>
      <Card p={3} backgroundColor={bgCard} align="center">
        <Text>
          Total Incentives:{" "}
          {headerData.totalBribes.toLocaleString(undefined, {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
          })}
        </Text>
        <Text>
          avg $/1000 VP:{" "}
          {headerData.avgPer1000.toLocaleString(undefined, {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 2,
          })}
        </Text>
        <Text>Bribed Voter: {headerData.bribedVoter}</Text>
      </Card>
    </Wrap>
  );
};
