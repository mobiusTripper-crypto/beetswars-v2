// DONE: switch API v1 to TRPC
// DONE: remove unused vars
// TODO: redo route parameter handling

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Wrap,
  Text,
  Box,
  Center,
  Divider,
  useColorModeValue,
  HStack,
  Icon,
  Button,
  Link,
  VStack,
  Progress,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useGlobalContext } from "contexts/GlobalContext";
import { trpc } from "utils/trpc";
import { ImArrowUpRight2 as ArrowIcon } from "react-icons/im";
import type { BribeOffer } from "types/bribelist.trpc";
import { useGetVp } from "hooks/useGetVp";
import { useAccount } from "wagmi";

export default function Round() {
  const account = useAccount();
  const bgCard = useColorModeValue("#D5E0EC", "#1C2635");
  const router = useRouter();
  const number = router.query.number || "";
  const { voteActive, setVoteActive, requestedRound, display, setDisplay } = useGlobalContext();
  const bribeData = trpc.bribes.list.useQuery(
    { round: requestedRound },
    {
      refetchOnWindowFocus: voteActive,
      refetchIntervalInBackground: false,
      refetchInterval: voteActive ? 60000 : 0,
      staleTime: voteActive ? 30000 : Infinity,
      cacheTime: voteActive ? 120000 : Infinity,
    }
  ).data?.bribefile;

  const snapshotLink = "https://snapshot.org/#/beets.eth/proposal/" + bribeData?.header.proposal;
  const votingPower: number = useGetVp();

  useEffect(() => {
    if (bribeData?.header.voteState) {
      switch (bribeData.header.voteState) {
        case "active":
          setVoteActive(true);
          break;
        default:
          setVoteActive(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bribeData]);

  useEffect(() => {
    if (number[1]) {
      switch (number[1]) {
        case "table":
          setDisplay("table");
          break;
        default:
          setDisplay("cards");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [number]);

  if (!bribeData) {
    return (
      <>
        <Progress size="xs" isIndeterminate />
      </>
    );
  }

  return (
    <>
      <Box>
        <Center>
          <Box>
            <Link href={snapshotLink} isExternal>
              <Button
                fontSize="2rem"
                whiteSpace="normal"
                height="auto"
                blockSize="auto"
                variant="unstyled"
                size="md"
                rightIcon={<Icon as={ArrowIcon} h="12px" w="12px" />}
              >
                <Text fontWeight="600" fontSize={["sm", "xl", "3xl", "4xl", "5xl"]}>
                  {bribeData?.header.roundName}
                </Text>
              </Button>
            </Link>
          </Box>
        </Center>
        <Center>
          <Grid mt={5} templateColumns="1fr 1fr 1fr" fontSize="lg" gap={5}>
            <GridItem>
              <HStack>
                <Text>Vote Start:</Text>
                <Text>{bribeData?.header.voteStart}</Text>
              </HStack>
            </GridItem>
            <GridItem>
              <HStack>
                <Text>Votes Total:</Text>
                <Text>{bribeData?.header.totalVotes.toLocaleString("en-us")}</Text>
              </HStack>
            </GridItem>
            <GridItem>
              <HStack>
                <Text>Total Incentives:</Text>
                <Text>{bribeData?.header.totalBribes.toLocaleString("en-us")}</Text>
              </HStack>
            </GridItem>
            <GridItem>
              <HStack>
                <Text>Vote End:</Text>
                <Text>{bribeData?.header.voteEnd}</Text>
              </HStack>
            </GridItem>
            <GridItem>
              <HStack>
                <Text>Incentivized Pools:</Text>
                <Text>{bribeData?.header.bribedVotes.toLocaleString("en-us")}</Text>
              </HStack>
            </GridItem>
            <GridItem>
              {" "}
              <HStack>
                <Text>avg/1kfB:</Text>
                <Text>{bribeData?.header.avgPer1000}</Text>
              </HStack>
            </GridItem>
            <GridItem>
              <HStack>
                <Text>Time Left:</Text>
                <Text>{bribeData?.header.timeRemaining}</Text>
              </HStack>
            </GridItem>
            <GridItem>
              <HStack>
                <Text>Total Voter:</Text>
                <Text>{bribeData?.header.totalVoter}</Text>
              </HStack>
            </GridItem>
            <GridItem>
              <HStack>
                <Text>Bribed Voter:</Text>
                <Text>{bribeData?.header.bribedVoter}</Text>
              </HStack>
            </GridItem>
          </Grid>
        </Center>
      </Box>
      {display === "cards" ? (
        <Center>
          <Wrap justify="center" spacing={10} mt={10}>
            {bribeData?.bribelist?.map(
              (bribe: BribeOffer, i: number): JSX.Element => (
                <Box
                  key={i}
                  p={5}
                  border="1px"
                  width="300px"
                  borderRadius={20}
                  backgroundColor={bgCard}
                >
                  <Box>
                    {/* <Box> */}
                    <Link href={bribe.poolurl} isExternal>
                      <Button
                        whiteSpace="normal"
                        height="auto"
                        blockSize="auto"
                        variant="unstyled"
                        size="lg"
                        rightIcon={<Icon as={ArrowIcon} h="12px" w="12px" />}
                      >
                        {bribe.poolname}
                      </Button>
                    </Link>
                    <Divider height="1px" bg="red" my={3} />
                    <Box>
                      <Text fontSize="sm">{bribe.rewarddescription}</Text>
                      <Text as="i" fontSize="xs">
                        {bribe.assumption}
                      </Text>
                    </Box>
                    <Divider height="1px" bg="red" my={3} />
                    <VStack align="left">
                      <HStack>
                        <Text>{bribe.label}:</Text>
                        <Text as="b">${bribe.rewardAmount.toLocaleString("en-us")}</Text>
                      </HStack>
                      <HStack>
                        <Text>Vote Total:</Text>
                        <Text as="b">
                          {bribe.percent} % - [{bribe.votes.toLocaleString("en-us")}]
                        </Text>
                      </HStack>
                      <HStack>
                        <Text>$/1000fBeets:</Text>
                        <Text as="b">{bribe.usdPer1000Vp.toFixed(2)}</Text>
                      </HStack>
                    </VStack>
                  </Box>
                </Box>
              )
            )}
          </Wrap>
        </Center>
      ) : (
        <Center>
          <TableContainer>
            <Table variant="striped">
              <Thead>
                <Tr>
                  <Th isNumeric>voteindex</Th>
                  <Th>poolname</Th>
                  <Th>description</Th>
                  <Th>Link</Th>
                </Tr>
              </Thead>
              <Tbody>
                {bribeData?.bribelist.map(
                  (bribe: BribeOffer, i: number): JSX.Element => (
                    <Tr key={i}>
                      <Td isNumeric> {bribe.voteindex}</Td>
                      <Td>{bribe.poolname}</Td>
                      <Td>{bribe.rewarddescription}</Td>
                      <Td>
                        <Link href={bribe.poolurl}>link</Link>
                      </Td>
                    </Tr>
                  )
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </Center>
      )}
    </>
  );
}
