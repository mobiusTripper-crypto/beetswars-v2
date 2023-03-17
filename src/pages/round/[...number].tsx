import {
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
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  IconButton,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useGlobalContext } from "contexts/GlobalContext";
import { trpc } from "utils/trpc";
import { ImArrowUpRight2 as ArrowIcon } from "react-icons/im";
import { GoQuestion as QuestionIcon } from "react-icons/go";
import type { BribeOffer } from "types/bribelist.trpc";
import { useGetVp } from "hooks/useGetVp";
import { useVoteState } from "hooks/useVoteState";
import { useRoundList } from "hooks/useRoundList";
import { Summary } from "components/Summary";
import { OfferTable } from "components/TableView";

export default function Round() {
  const bgCard = useColorModeValue("#D5E0EC", "#1C2635");
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: voteStateActive, loaded: voteStateLoaded } = useVoteState();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: roundList, loaded: roundListLoaded } = useRoundList();
  const { requestedRound, display } = useGlobalContext();
  const { data: votingPower, connected: accountConnected } = useGetVp();
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

  console.log("vote state:", voteStateActive, requestedRound, roundList.latest, router.isReady);

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
                        <Text>$/1000 VP:</Text>
                        <Text as="b">{bribe.usdPer1000Vp.toFixed(2)}</Text>
                        <Popover placement="auto-start">
                          <PopoverTrigger>
                            <IconButton
                              isRound
                              height="0"
                              minWidth="0"
                              aria-label="Explain Item"
                              icon={<Icon as={QuestionIcon} />}
                            />
                          </PopoverTrigger>
                          <PopoverContent>
                            <PopoverHeader fontWeight="semibold">$/1000 VP</PopoverHeader>
                            <PopoverBody>
                              Value in $ received for voting on this pool with 1k votes
                            </PopoverBody>
                          </PopoverContent>
                        </Popover>
                      </HStack>
                      {accountConnected &&
                      voteStateActive &&
                      requestedRound === roundList.latest ? (
                        <HStack marginTop="auto">
                          <Text>Max single reward:</Text>
                          <Text as="b">
                            {((bribe.usdPer1000Vp * votingPower) / 1000).toFixed(2)}
                          </Text>
                          <Popover placement="auto-start">
                            <PopoverTrigger>
                              <IconButton
                                isRound
                                height="0"
                                minWidth="0"
                                aria-label="Explain Item"
                                icon={<Icon as={QuestionIcon} />}
                              />
                            </PopoverTrigger>
                            <PopoverContent>
                              <PopoverHeader fontWeight="semibold">Max single reward</PopoverHeader>
                              <PopoverBody>
                                Value in $ received for using 100% VP on this pool with current
                                connected account.
                              </PopoverBody>
                            </PopoverContent>
                          </Popover>
                        </HStack>
                      ) : (
                        ""
                      )}
                    </VStack>
                  </Box>
                </Box>
              )
            )}
          </Wrap>
        </Center>
      ) : (
        <OfferTable data={bribeData.bribelist} />
      )}
      <Text fontSize="sm" align="right" mr={5}>
        {bribeData.header.bribefileVersion ? bribeData?.header.bribefileVersion : ""}
      </Text>
    </>
  );
}
