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
import { useState } from "react";

const Admin: NextPage = () => {
  const addUser = trpc.login.addUser.useMutation();
  const addApikey = trpc.login.addApikey.useMutation();

  const [username, setUsername] = useState("");
  const [apikey, setApikey] = useState("");

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
            <Heading size="md">Add user</Heading>
          </CardHeader>
          <CardBody>
            <Box>
              <HStack gap={4}>
                <Text>Insert Github Username for admin user to add:</Text>
                <input
                  type="text"
                  value={username}
                  onChange={event => setUsername(event.target.value)}
                />
                <Button onClick={() => addUser.mutate({ key: username })}>Add user</Button>
              </HStack>
            </Box>
          </CardBody>
        </Card>

        <Card m={6}>
          <CardHeader>
            <Heading size="md">Add API key</Heading>
          </CardHeader>
          <CardBody>
            <Box>
              <HStack gap={4}>
                <Text>Insert random string to add (minimum 12 characters):</Text>
                <input
                  type="text"
                  value={apikey}
                  onChange={event => setApikey(event.target.value)}
                />
                <Button disabled={apikey.length < 12} onClick={() => addApikey.mutate({ key: apikey })}>Add API key</Button>
              </HStack>
            </Box>
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

export default Admin;
