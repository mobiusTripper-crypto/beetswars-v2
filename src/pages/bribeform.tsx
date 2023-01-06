import { type NextPage } from "next";
import { Button, Grid, GridItem, HStack, Text, VStack } from "@chakra-ui/react";
import { useSession, signIn, signOut } from "next-auth/react";
import { trpc } from "../utils/trpc";

const BribeForm: NextPage = () => {
  const { data: session, status } = useSession();
  const userlist = trpc.login.list.useQuery().data?.userlist ?? []; // array to compare
  const bribeList = trpc.bribes.list.useQuery().data?.bribeList; // array to compare

  // // do this on any event (button click, ...)
  // const newUser = ""; // example
  // trpc.login.addUser.useMutation().mutate({key: newUser});

  if (
    session &&
    status === "authenticated" &&
    userlist.includes(session?.user?.name || "")
  ) {
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
        <Button onClick={() => signIn()}>Sign in</Button>
      </HStack>
    </VStack>
  );
};

export default BribeForm;
