import { type NextPage } from "next";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useSession, signIn, signOut } from "next-auth/react";
import { trpc } from "../utils/trpc";
import type { Bribedata, Reward } from "types/bribedata.raw";

const Admin: NextPage = () => {
  const addRound = trpc.bribes.addRound.useMutation();
  const editRound = trpc.bribes.editRound.useMutation();
  const addToken = trpc.bribes.addToken.useMutation();
  const editToken = trpc.bribes.editToken.useMutation();
  const deleteToken = trpc.bribes.deleteToken.useMutation();
  const addOffer = trpc.bribes.addOffer.useMutation();
  const editOffer = trpc.bribes.editOffer.useMutation();
  const deleteOffer = trpc.bribes.deleteOffer.useMutation();
  const addReward = trpc.bribes.addReward.useMutation();
  const editReward = trpc.bribes.editReward.useMutation();
  const deleteReward = trpc.bribes.deleteReward.useMutation();


  const bribeCalculated = trpc.bribes.list.useQuery({ round: 29 }).data?.bribefile;

  const round = 99;
  const snapshot = "0xae9c3b86ea25fe5635b0ba6de94985fa946d87631c2ac24fc4309923750c05ef";

  const bribefile = {
    version: "99.1.1",
    snapshot: "0xa976e32dd960131fe718342a94101d545d61353fee50ae9b71129c6eb3db39ba",
    description: "Farming Incentive Gauge Vote (round 99)",
    round: 99,
    tokendata: [],
    bribedata: [],
  };

  const token = {
    token: "FBEETS",
    tokenaddress: "0xfcef8a994209d6916EB2C86cDD2AFD60Aa6F54b1",
    coingeckoid: "",
    isbpt: true,
    lastprice: 0.07999324175657402,
    tokenId: 1,
  };

  const offer: Bribedata = {
    voteindex: 3,
    poolname: "Pirate Party (LQDR-FTM)",
    poolurl:
      "https://beets.fi/pool/0x5e02ab5699549675a6d3beeb92a62782712d0509000200000000000000000138",
    rewarddescription: "$2,900 in LQDR + raffle of 3 xLQDR FNFTs worth $100 each ",
    assumption: "FNFTs not included in calculation",
    percentagethreshold: 20,
    offerId: 2,
    reward: [
      {
        type: "fixed",
        token: "LQDR",
        amount: 2900,
        isfixed: true,
        rewardId: 1,
      },
    ],
  };

  const reward: Reward = {
    type: "percent",
    token: "LQDR",
    amount: 200,
    isfixed: true,
    rewardId: 2,
  };

  const { data: session, status } = useSession();

  if (session && status === "authenticated") {
    return (
      <>
        <HStack
          m={6}
          justifyContent="flex-end"
        >
          <Text>Signed in as {session?.user?.name}</Text>
          <Button onClick={() => signOut()}>Sign out</Button>
        </HStack>

        <Card m={6}>
          <CardHeader>
            <Heading size="md">Round</Heading>
          </CardHeader>
          <CardBody>
            <Box>
              <HStack gap={4}>
                <Button onClick={() => addRound.mutate(bribefile)}>Add round</Button>
                <Button onClick={() => editRound.mutate(bribefile)}>Edit round</Button>
              </HStack>
            </Box>
          </CardBody>
        </Card>

        <Card m={6}>
          <CardHeader>
            <Heading size="md">Token</Heading>
          </CardHeader>
          <CardBody>
            <Box>
              <HStack gap={4}>
                <Button onClick={() => addToken.mutate({ round, payload: token })}>
                  Add token
                </Button>
                <Button onClick={() => editToken.mutate({ round, payload: token })}>
                  Edit token
                </Button>
                <Button onClick={() => deleteToken.mutate({ round, tokenId: 1 })}>
                  Delete token
                </Button>
              </HStack>
            </Box>
          </CardBody>
        </Card>

        <Card m={6}>
          <CardHeader>
            <Heading size="md">Bribe Offer</Heading>
          </CardHeader>
          <CardBody>
            <Box>
              <HStack gap={4}>
                <Button onClick={() => addOffer.mutate({ round, payload: offer })}>
                  Add offer
                </Button>
                <Button onClick={() => editOffer.mutate({ round, payload: offer })}>
                  Edit offer
                </Button>
                <Button onClick={() => deleteOffer.mutate({ round, offerId: 1 })}>
                  Delete offer
                </Button>
                <Button onClick={() => trpc.bribes.suggest.useQuery({ snapshot, round: 29 }).data?.votelist}>
                  get Suggestions
                </Button>
              </HStack>
            </Box>
          </CardBody>
        </Card>

        <Card m={6}>
          <CardHeader>
            <Heading size="md">Rewards</Heading>
          </CardHeader>
          <CardBody>
            <Box>
              <HStack gap={4}>
                <Button onClick={() => addReward.mutate({ payload: reward, round, offer: 1 })}>
                  Add reward
                </Button>
                <Button onClick={() => editReward.mutate({ payload: reward, round, offer: 1 })}>
                  Edit reward
                </Button>
                <Button onClick={() => deleteReward.mutate({ round, offer: 1, reward: 2 })}>
                  Delete reward
                </Button>
              </HStack>
            </Box>
          </CardBody>
        </Card>
        <Card m={6}>
          <Box m={4}>
            {JSON.stringify(bribeCalculated)}
          </Box>
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

export default Admin;
