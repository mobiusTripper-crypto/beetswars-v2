import type { NextPage } from "next";
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
  // useToast,
  VStack,
  Progress,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";
import { useGlobalContext } from "contexts/GlobalContext";
import { EditRoundModal } from "components/EditRound/EditRound";
import { DeleteOfferModal } from "components/DeleteOfferModal";
import { EditOfferModal } from "components/EditOffer/EditOfferModal";
import type { Bribedata, Bribefile, Tokendata } from "types/bribedata.raw";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { EditTokenModal } from "components/EditToken/EditToken";
import { DeleteTokenModal } from "components/EditToken/DeleteTokenModal";

import Router from "next/router";
import AdminNav from "components/AdminNav";

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
  const emptyToken: Tokendata = {
    token: "",
    tokenId: 0,
  };
  const queryClient = useQueryClient();
  const { requestedRound } = useGlobalContext();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (!session) Router.push("/admin");
  });

  const bribedataQuery = trpc.bribes.list_raw.useQuery(
    { round: requestedRound },
    { enabled: !!requestedRound && !!session }
  );
  const suggestionQuery = trpc.bribes.suggest.useQuery(
    { round: requestedRound || 0 },
    { enabled: !!requestedRound && !!session }
  );
  const tokenlistQuery = trpc.bribes.suggestToken.useQuery(
    { round: requestedRound || 0 },
    { enabled: !!requestedRound && !!session }
  );
  const addOfferMut = trpc.bribes.addOffer.useMutation({
    onSuccess: () => queryClient.invalidateQueries(),
  });
  const editOfferMut = trpc.bribes.editOffer.useMutation({
    onSuccess: () => queryClient.invalidateQueries(),
  });
  const setlatest = trpc.rounds.setLatest.useMutation();
  const editRound = trpc.bribes.editRound.useMutation({
    onSuccess: () => queryClient.invalidateQueries(),
  });
  const addRound = trpc.bribes.addRound.useMutation({
    onSuccess: () => queryClient.invalidateQueries(),
  });
  const editToken = trpc.bribes.editToken.useMutation({
    onSuccess: () => queryClient.invalidateQueries(),
  });
  const addToken = trpc.bribes.addToken.useMutation({
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
  const saveNewToken = (payload: Tokendata) => {
    addToken.mutate({ round: requestedRound || 0, payload });
  };
  const saveEditToken = (payload: Tokendata) => {
    editToken.mutate({ round: requestedRound || 0, payload });
  };
  const setLatest = () => {
    requestedRound && setlatest.mutate({ latest: requestedRound });
  };
  // // this function shows toast message - just for testing button function
  // // TODO: remove after testing
  // const toast = useToast();
  // function showToast(action: string) {
  //   toast({
  //     title: "Button clicked.",
  //     description: action,
  //     status: "success",
  //     duration: 5000,
  //     isClosable: true,
  //   });
  // }
  // //////////////////////////////

  if (session && status === "authenticated") {
    if (bribedataQuery.isLoading)
      return (
        <>
          <AdminNav />
          <Progress size="xs" isIndeterminate />
        </>
      );
    if (bribedataQuery.isError || !bribedataQuery.data || !bribedataQuery.data.bribefile)
      return <Heading>Error</Heading>;
    return (
      <>
        <AdminNav />
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
              <EditTokenModal
                data={emptyToken}
                lasttokens={tokenlistQuery.data?.tokenlist || []}
                isNew
                onSubmit={saveNewToken}
              />
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
                    <EditTokenModal data={token} isNew={false} onSubmit={saveEditToken} />
                    <Spacer />
                    {requestedRound && (
                      <DeleteTokenModal round={requestedRound} tokenId={token.tokenId} />
                    )}
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
                  suggestions={suggestionQuery.data?.votelist || []}
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
      </HStack>
    </VStack>
  );
};

export default BribeForm;
