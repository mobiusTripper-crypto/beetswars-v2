import { type NextPage } from "next";
import { Button, Grid, GridItem, HStack, Text, VStack } from "@chakra-ui/react";
import { useSession, signIn, signOut } from "next-auth/react";
import { trpc } from "../utils/trpc";

const BribeForm: NextPage = () => {
  const { data: session, status } = useSession();
  const bribeList = trpc.bribes.list.useQuery().data?.bribeList; // array to compare

  // // // do this on any event (button click, ...), must be authenticated to run this
  // const newUser = ""; // example
  // trpc.login.addUser.useMutation().mutate({ key: newUser });

  if (session && status === "authenticated") {
    return (
      <>
        <HStack>
          <Text>Signed in as {session?.user?.name}</Text>
          <Button onClick={() => signOut()}>Sign out</Button>
        </HStack>
        <Grid gap={4} templateColumns="1fr 1fr 6fr 2fr">
          <GridItem fontWeight="800">Index</GridItem>
          <GridItem fontWeight="800">Pool Name</GridItem>
          <GridItem fontWeight="800">Description</GridItem>
          <GridItem fontWeight="800">Assumption</GridItem>
          {!bribeList ||
            bribeList.bribedata.map((bribe) => (
              <>
                <GridItem>{bribe.voteindex}</GridItem>
                <GridItem>{bribe.poolname}</GridItem>
                <GridItem>{bribe.rewarddescription}</GridItem>
                <GridItem>{bribe.assumption}</GridItem>
              </>
            ))}
        </Grid>
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
