// DONE: switch API v1 to TRPC
// DONE: remove unused vars
// TODO: redo route parameter handling

import {
  // Table,
  // Thead,
  // Tbody,
  // Tr,
  // Th,
  // Td,
  // TableContainer,
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
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useGlobalContext } from "contexts/GlobalContext";
import { trpc } from "utils/trpc";
import { ImArrowUpRight2 as ArrowIcon } from "react-icons/im";
import type { BribeOffer } from "types/bribelist.trpc";
import { useGetVp } from "hooks/useGetVp";
import { useVoteState } from "hooks/useVoteState";
import { Summary } from "components/Summary";
import { OfferTable } from "components/TableView";

export default function Round() {
  const bgCard = useColorModeValue("#D5E0EC", "#1C2635");
  const router = useRouter();
  const number = router.query.number || "";
  const { data: voteStateActive, loaded: voteStateLoaded } = useVoteState();

  const { requestedRound, display, setDisplay } = useGlobalContext();
  const bribeData = trpc.bribes.list.useQuery(
    { round: requestedRound },
    {
      refetchOnWindowFocus: voteStateActive,
      refetchIntervalInBackground: false,
      refetchInterval: voteStateActive ? 60000 : 0,
      staleTime: voteStateActive ? 30000 : Infinity,
      cacheTime: voteStateActive ? 120000 : Infinity,
      enabled: requestedRound !== undefined,
    }
  ).data?.bribefile;

  const snapshotLink = "https://snapshot.org/#/beets.eth/proposal/" + bribeData?.header.proposal;
  const { data: votingPower, connected: accountConnected } = useGetVp();

  useEffect(() => {
    console.log("vote state:", voteStateActive, voteStateLoaded, requestedRound);
  }, [voteStateActive, voteStateLoaded, requestedRound]);

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
                whiteSpace="normal"
                height="auto"
                variant="unstyled"
                fontSize={["sm", "xl", "3xl", "4xl", "5xl"]}
                fontWeight="600"
                rightIcon={<Icon as={ArrowIcon} w={[2, 3, 4, 6, 8]} h={[2, 3, 4, 6, 8]} />}
              >
                {bribeData?.header.roundName}
              </Button>
            </Link>
          </Box>
        </Center>
        <Summary headerData={bribeData?.header} />
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
                    <Divider h="2px" bg="#ED1200" my={3} />
                    <Box>
                      <Text fontSize="sm">{bribe.rewarddescription}</Text>
                      <Text as="i" fontSize="xs">
                        {bribe.assumption}
                      </Text>
                    </Box>
                    <Divider h="2px" bg="#ED1200" my={3} />
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
                        <Text>$/1kVP:</Text>
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
        <OfferTable data={bribeData.bribelist} />
        // <Center>
        //   <TableContainer>
        //     <Table variant="striped">
        //       <Thead>
        //         <Tr>
        //           <Th isNumeric>voteindex</Th>
        //           <Th>poolname</Th>
        //           <Th>description</Th>
        //           <Th>Link</Th>
        //         </Tr>
        //       </Thead>
        //       <Tbody>
        //         {bribeData?.bribelist.map(
        //           (bribe: BribeOffer, i: number): JSX.Element => (
        //             <Tr key={i}>
        //               <Td isNumeric> {bribe.voteindex}</Td>
        //               <Td>{bribe.poolname}</Td>
        //               <Td>{bribe.rewarddescription}</Td>
        //               <Td>
        //                 <Link href={bribe.poolurl}>link</Link>
        //               </Td>
        //             </Tr>
        //           )
        //         )}
        //       </Tbody>
        //     </Table>
        //   </TableContainer>
        // </Center>
      )}
      <Text fontSize="sm" align="right" mr={5}>
        data: v{bribeData?.header.bribefileVersion}
      </Text>
    </>
  );
}
