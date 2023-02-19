import { type NextPage } from "next";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Spacer,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useSession, signIn, signOut } from "next-auth/react";
import { trpc } from "../utils/trpc";
import { useGlobalContext } from "contexts/GlobalContext";
import { EditRoundModal } from "components/EditRound/EditRound";
import { DeleteOfferModal } from "components/DeleteOfferModal";
import { EditOfferModal } from "components/EditOffer/EditOfferModal";
import type { Bribedata } from "types/bribedata.raw";
import { useEffect, useState } from "react";

const BribeForm: NextPage = () => {
  const { requestedRound, requestRound } = useGlobalContext();
  const { data: session, status } = useSession();
  const bribedataRaw = trpc.bribes.list_raw.useQuery(
    { round: requestedRound },
    { enabled: !!requestedRound }
  ).data?.bribefile;
  const addOfferMut = trpc.bribes.addOffer.useMutation();
  const editOfferMut = trpc.bribes.editOffer.useMutation();
  const setlatest = trpc.rounds.setLatest.useMutation();

  const [bribedata, setBribedata] = useState(bribedataRaw);
  useEffect(() => {
    setBribedata(bribedataRaw);
  }, [requestedRound, bribedataRaw]);

  const emptyround: Bribedata = {
    voteindex: 0,
    poolname: "",
    poolurl: "",
    rewarddescription: "",
    reward: [],
    offerId: 0,
  };
  //This doesn't actually work for new or edit ....
  const refreshRound = (round: string | number) => {
    console.log("refresh", round);
    requestRound(Number(round));
  };

  const saveNewOffer = (payload: Bribedata) => {
    requestedRound && addOfferMut.mutate({ round: requestedRound, payload });
    refreshRound(requestedRound || 0);
  };
  const saveEditOffer = (payload: Bribedata) => {
    requestedRound && editOfferMut.mutate({ round: requestedRound, payload });
    refreshRound(requestedRound || 0);
  };
  const setLatest = () => {
    requestedRound && setlatest.mutate({ latest: requestedRound });
  };
  // this function shows toast message - just for testing button function
  // TODO: remove after testing
  const toast = useToast();
  function showToast(action: string) {
    toast({
      title: "Button clicked.",
      description: action,
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  }
  //////////////////////////////

  if (session && status === "authenticated") {
    return (
      <>
        <HStack m={6} justifyContent="flex-end">
          <Text>Signed in as {session?.user?.name}</Text>
          <Button onClick={() => signOut()}>Sign out</Button>
        </HStack>
        <Card m={6}>
          <CardHeader>
            <HStack spacing={4} justify="space-between">
              <Heading size="md">Edit Round {requestedRound}</Heading>
              {/* <RoundSelector handleChange={changeRound} /> */}
              <EditRoundModal isNew refresh={refreshRound} />
            </HStack>
          </CardHeader>
          <CardBody>
            <HStack justify="space-between">
              <Grid gap={4} templateColumns="1fr 3fr">
                <GridItem fontWeight="800">Version</GridItem>
                <GridItem>{bribedata?.version}</GridItem>
                <GridItem fontWeight="800">Description</GridItem>
                <GridItem>{bribedata?.description}</GridItem>
                <GridItem fontWeight="800">Snapshot</GridItem>
                <GridItem>
                  <Text noOfLines={1} maxW="300px">
                    {bribedata?.snapshot}
                  </Text>
                </GridItem>
              </Grid>
              <VStack>
                <Button onClick={setLatest}>Set Round {requestedRound} as latest</Button>
                <EditRoundModal roundNumber={requestedRound} isNew={false} refresh={refreshRound} />
              </VStack>
            </HStack>
          </CardBody>
        </Card>

        <Card m={6}>
          <CardHeader>
            <Flex>
              <Heading size="md">Tokens:</Heading>
              <Spacer />
              <Button onClick={() => showToast(`add new token`)}>add new token</Button>
            </Flex>
          </CardHeader>
          <CardBody>
            {!bribedata ||
              bribedata?.tokendata.map((token, index) => (
                <Grid gap={4} templateColumns="1fr 3fr 3fr 1fr" key={index}>
                  <GridItem>{token.tokenId}</GridItem>
                  <GridItem>{token.token}</GridItem>
                  <GridItem>{token.tokenaddress}</GridItem>
                  <GridItem>
                    <Flex justifyContent="flex-end">
                      <Spacer />
                      <Button onClick={() => showToast(`edit token ${token.tokenId}`)}>Edit</Button>
                      <Spacer />
                      <Button onClick={() => showToast(`delete token ${token.tokenId}`)}>
                        Delete
                      </Button>
                    </Flex>
                  </GridItem>
                </Grid>
              ))}
          </CardBody>
        </Card>

        <Card m={6}>
          <CardHeader>
            <Flex>
              <Heading size="md">Offers:</Heading>
              <Spacer />
              {requestedRound && (
                <EditOfferModal
                  isNew
                  roundNo={requestedRound}
                  data={emptyround}
                  tokens={bribedata?.tokendata.map(x => x.token) ?? []}
                  onSubmit={saveNewOffer}
                />
              )}
            </Flex>
          </CardHeader>
          <CardBody>
            {!bribedata ||
              bribedata.bribedata.map((bribe, index) => (
                <Grid gap={4} templateColumns="1fr 3fr 3fr 1fr" key={index} my={2}>
                  <GridItem>{bribe.offerId}</GridItem>
                  <GridItem>{bribe.poolname}</GridItem>
                  <GridItem>{bribe.rewarddescription}</GridItem>
                  <GridItem>
                    <HStack spacing={3}>
                      {requestedRound && (
                        <EditOfferModal
                          roundNo={requestedRound}
                          isNew={false}
                          data={bribe}
                          tokens={bribedata.tokendata.map(x => x.token)}
                          onSubmit={saveEditOffer}
                        />
                      )}
                      {requestedRound && (
                        <DeleteOfferModal round={requestedRound} offerId={bribe.offerId} />
                      )}
                    </HStack>
                  </GridItem>
                </Grid>
              ))}
          </CardBody>
        </Card>
      </>
    );
  }
  return (
    <VStack>
      <HStack>
        <Text>Not signed in</Text>
        <Button onClick={() => signIn()}>Sign in</Button>
      </HStack>
    </VStack>
  );
};

export default BribeForm;
