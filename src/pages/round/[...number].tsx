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
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useGlobalContext } from "contexts/GlobalContext";
import { trpc } from "utils/trpc";
import { ImArrowUpRight2 as ArrowIcon } from "react-icons/im";
import type { BribeOffer } from "types/bribelist.trpc";

export default function Round() {
  const bgCard = useColorModeValue("#D5E0EC", "#1C2635");
  const router = useRouter();
  const number = router.query.number || "";
  // const { requestedRound, requestRound, display, setDisplay } = useGlobalContext();
  const { requestedRound, display, setDisplay } = useGlobalContext();
  const bribeData = trpc.bribes.list.useQuery({ round: requestedRound }, { enabled: !!number }).data
    ?.bribefile;

  console.log(router.query, number[0]);

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

  return (
    <>
      <Box>
        <Center>
          <Text fontSize="4xl">{bribeData?.header.roundName}</Text>
        </Center>
        <Center>
          <Text fontSize="1.4rem">
            Vote Start: {bribeData?.header.voteStart} - Vote End: {bribeData?.header.voteEnd} -{" "}
            {bribeData?.header.timeRemaining}
          </Text>
        </Center>
        <Center>
          <Text fontSize="1.4rem">
            Votes Total: {bribeData?.header.totalVotes.toLocaleString("en-us")} - on incentivized
            Pools: {bribeData?.header.bribedVotes.toLocaleString("en-us")} - Total Voter:{" "}
            {bribeData?.header.totalVoter} - Bribed Voter: {bribeData?.header.bribedVoter}
          </Text>
        </Center>
        <Center>
          <Text fontSize="1.4rem">
            Total Incentives: {bribeData?.header.totalBribes.toLocaleString("en-us")} - avg/1kfB:{" "}
            {bribeData?.header.avgPer1000}{" "}
          </Text>
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
