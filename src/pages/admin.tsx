import { type NextPage } from "next";
import { Box, Button, Card, CardBody, CardHeader, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import { useSession, signIn, signOut } from "next-auth/react";
import { trpc } from "../utils/trpc";

function addUser (username: string) {
  const result = trpc.login.addUser.useMutation().mutate({ key: username });
  return result;
}

const Admin: NextPage = () => {
  const { data: session, status } = useSession();

  if (session && status === "authenticated") {
    return (
      <Card>
        <CardHeader>
          <Heading size='md'>Add user</Heading>
        </CardHeader>

        <CardBody>
          <HStack>
            <Text>Signed in as {session?.user?.name}</Text>
            <Button onClick={() => signOut()}>Sign out</Button>
          </HStack>
          <Box>
            <Text>Insert Github Username for user to add:</Text>
            <Text>##Form here##</Text>
            <Button onClick={() => addUser("user")}>Add user</Button>
          </Box>
        </CardBody>
      </Card>
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
