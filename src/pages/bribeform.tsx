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
import type { Bribedata, Bribefile } from "types/bribedata.raw";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

const BribeForm: NextPage = () => {
  const emptyoffer: Bribedata = {
    voteindex: 0,
    poolname: "",
    poolurl: "",
    rewarddescription: "",
    reward: [],
    offerId: 0,
  };
  const emptyround: Bribefile = {
    round: 0,
    version: "",
    description: "",
    snapshot: "",
    tokendata: [],
    bribedata: [],
  };

  const queryClient = useQueryClient();
  const { requestedRound } = useGlobalContext();
  const { data: session, status } = useSession();

  const bribedataQuery = trpc.bribes.list_raw.useQuery(
    { round: requestedRound },
    { enabled: !!requestedRound }
  );
  const addOfferMut = trpc.bribes.addOffer.useMutation({
    onSuccess: () => queryClient.invalidateQueries(),
  });
  const editOfferMut = trpc.bribes.editOffer.useMutation({
    onSuccess: () => queryClient.invalidateQueries(),
  });
  const setlatest = trpc.rounds.setLatest.useMutation();
  const editRound = trpc.bribes.editRound.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
  const addRound = trpc.bribes.addRound.useMutation({
    onSuccess: () => queryClient.invalidateQueries(),
  });

  useEffect(() => {
    queryClient.invalidateQueries();
    queryClient.refetchQueries();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestedRound]);

  const saveNewOffer = (payload: Bribedata) => {
    requestedRound && addOfferMut.mutate({ round: requestedRound, payload });
  };
  const saveEditOffer = (payload: Bribedata) => {
    requestedRound && editOfferMut.mutate({ round: requestedRound, payload });
  };
  const saveNewRound = (payload: Bribefile) => {
    addRound.mutate(payload);
  };
  const saveEditRound = (payload: Bribefile) => {
    console.log('edit save"');
    editRound.mutate(payload);
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
    if (bribedataQuery.isLoading) return <Heading>Loading ...</Heading>;
    if (bribedataQuery.isError || !bribedataQuery.data || !bribedataQuery.data.bribefile)
      return <Heading>Error</Heading>;
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
              <EditRoundModal isNew data={emptyround} onSubmit={saveNewRound} />
            </HStack>
          </CardHeader>
          <CardBody>
            <HStack justify="space-between">
              <Grid gap={4} templateColumns="1fr 3fr">
                <GridItem fontWeight="800">Version</GridItem>
                <GridItem>{bribedataQuery.data.bribefile.version}</GridItem>
                <GridItem fontWeight="800">Description</GridItem>
                <GridItem>{bribedataQuery.data.bribefile.description}</GridItem>
                <GridItem fontWeight="800">Snapshot</GridItem>
                <GridItem>
                  <Text noOfLines={1} maxW="300px">
                    {bribedataQuery.data.bribefile.snapshot}
                  </Text>
                </GridItem>
              </Grid>
              <VStack>
                <Button onClick={setLatest}>Set Round {requestedRound} as latest</Button>
                <EditRoundModal
                  roundNumber={requestedRound}
                  isNew={false}
                  data={bribedataQuery.data.bribefile}
                  onSubmit={saveEditRound}
                />
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
            {bribedataQuery.data.bribefile.tokendata.map((token, index) => (
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
                  data={emptyoffer}
                  tokens={bribedataQuery.data.bribefile.tokendata.map(x => x.token) ?? []}
                  onSubmit={saveNewOffer}
                />
              )}
            </Flex>
          </CardHeader>
          <CardBody>
            {bribedataQuery.data.bribefile.bribedata.map((bribe, index) => (
              <Grid gap={4} templateColumns="1fr 3fr 3fr 1fr" key={index} my={2}>
                <GridItem>{bribe.offerId}</GridItem>
                <GridItem>{bribe.poolname}</GridItem>
                <GridItem>{bribe.rewarddescription}</GridItem>
                <GridItem>
                  <HStack spacing={3}>
                    {requestedRound && bribedataQuery.data.bribefile && (
                      <EditOfferModal
                        roundNo={requestedRound}
                        isNew={false}
                        data={bribe}
                        tokens={bribedataQuery.data.bribefile.tokendata.map(x => x.token)}
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
