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
import RoundSelector from "components/RoundSelector";
import { EditRoundModal } from "components/EditRound/EditRound";

const BribeForm: NextPage = () => {
  const { requestedRound, requestRound } = useGlobalContext();
  const round = +requestedRound || 0;
  const { data: session, status } = useSession();
  const bribedata = trpc.bribes.list_raw.useQuery({ round }).data?.bribefile;

  const changeRound = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value);
    requestRound(e.target.value);
  };

  const refreshRound = (round: string) => {
    console.log("refresh", round);
    requestRound(round);
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
              <Heading size="md">Edit Round {round}</Heading>
              <RoundSelector handleChange={changeRound} />
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
              <EditRoundModal roundNumber={round} isNew={false} refresh={refreshRound} />
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
            <Grid gap={4} templateColumns="1fr 3fr 3fr 1fr">
              {!bribedata ||
                bribedata?.tokendata.map(token => (
                  <>
                    <GridItem>{token.tokenId}</GridItem>
                    <GridItem>{token.token}</GridItem>
                    <GridItem>{token.tokenaddress}</GridItem>
                    <GridItem>
                      <Flex justifyContent="flex-end">
                        <Spacer />
                        <Button onClick={() => showToast(`edit token ${token.tokenId}`)}>
                          Edit
                        </Button>
                        <Spacer />
                        <Button onClick={() => showToast(`delete token ${token.tokenId}`)}>
                          Delete
                        </Button>
                      </Flex>
                    </GridItem>
                  </>
                ))}
            </Grid>
          </CardBody>
        </Card>

        <Card m={6}>
          <CardHeader>
            <Flex>
              <Heading size="md">Offers:</Heading>
              <Spacer />
              <Button onClick={() => showToast(`add new bribe`)}>add new offer</Button>
            </Flex>
          </CardHeader>
          <CardBody>
            <Grid gap={4} templateColumns="1fr 3fr 3fr 1fr">
              {!bribedata ||
                bribedata.bribedata.map(bribe => (
                  <>
                    <GridItem>{bribe.offerId}</GridItem>
                    <GridItem>{bribe.poolname}</GridItem>
                    <GridItem>{bribe.rewarddescription}</GridItem>
                    <GridItem>
                      <Flex justifyContent="flex-end">
                        <Spacer />
                        <Button onClick={() => showToast(`edit bribe ${bribe.offerId}`)}>
                          Edit
                        </Button>
                        <Spacer />
                        <Button onClick={() => showToast(`delete bribe ${bribe.offerId}`)}>
                          Delete
                        </Button>
                      </Flex>
                    </GridItem>
                  </>
                ))}
            </Grid>
          </CardBody>
        </Card>
      </>
    );
  }
  return (
    <VStack>
      <HStack>
        <Text>Not signed in</Text>
        <Button
          onClick={() =>
            //I think setting callbackUrl will do dynamic redirect, but not working just yet. so we can have just a single OAuth Github app
            //signIn("GitHubProvider", {callbackUrl: "http://localhost:3000/api/auth/callback/github",})
            signIn()
          }
        >
          Sign in
        </Button>
      </HStack>
    </VStack>
  );
};

export default BribeForm;
