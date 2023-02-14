import { Center, Grid, GridItem, HStack, Text } from "@chakra-ui/react";
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
      <Grid mt={5} templateColumns="1fr 1fr 1fr" fontSize="lg" gap={5}>
        <GridItem>
          <HStack>
            <Text>Vote Start:</Text>
            <Text>
              {new Intl.DateTimeFormat("en-GB", dateFormatOptions).format(new Date(headerData.voteStart))}
            </Text>
          </HStack>
        </GridItem>
        <GridItem>
          <HStack>
            <Text>Votes Total:</Text>
            <Text>{headerData.totalVotes.toLocaleString("en-us")}</Text>
          </HStack>
        </GridItem>
        <GridItem>
          <HStack>
            <Text>Total Incentives:</Text>
            <Text>{headerData.totalBribes.toLocaleString("en-us")}</Text>
          </HStack>
        </GridItem>
        <GridItem>
          <HStack>
            <Text>Vote End:</Text>
            <Text>
              {new Intl.DateTimeFormat("en-GB", dateFormatOptions).format(new Date(headerData.voteEnd))}
            </Text>
          </HStack>
        </GridItem>
        <GridItem>
          <HStack>
            <Text>Incentivized Pools:</Text>
            <Text>{headerData.bribedVotes.toLocaleString("en-us")}</Text>
          </HStack>
        </GridItem>
        <GridItem>
          {" "}
          <HStack>
            <Text>avg $/1kVP:</Text>
            <Text>{headerData.avgPer1000}</Text>
          </HStack>
        </GridItem>
        <GridItem>
          <HStack>
            <Text>Time Left:</Text>
            <Text>{headerData.timeRemaining}</Text>
          </HStack>
        </GridItem>
        <GridItem>
          <HStack>
            <Text>Total Voter:</Text>
            <Text>{headerData.totalVoter}</Text>
          </HStack>
        </GridItem>
        <GridItem>
          <HStack>
            <Text>Bribed Voter:</Text>
            <Text>{headerData.bribedVoter}</Text>
          </HStack>
        </GridItem>
      </Grid>
    </Center>
  );
};
