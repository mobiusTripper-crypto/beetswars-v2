import type { NextPage } from "next";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  HStack,
  Input,
  Link,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useSession, signIn } from "next-auth/react";
import { trpc } from "../utils/trpc";
import { useState } from "react";
import NextLink from "next/link";

const Admin: NextPage = () => {
  const addUser = trpc.login.addUser.useMutation();
  const addApikey = trpc.login.addApikey.useMutation();

  const [username, setUsername] = useState("");
  const [apikey, setApikey] = useState("");

  const { data: session, status } = useSession();

  const saveUsernameHandler = () => {
    addUser.mutate({ key: username });
    setUsername("");
  };
  const saveApikeyHandler = () => {
    addApikey.mutate({ key: apikey });
    setApikey("");
  };

  if (session && status === "authenticated") {
    return (
      <>
        <Card m={6} p={6}>
          <HStack gap={6}>
            <Link as={NextLink} href="/bribeform">
              <Button>Bribe Forms</Button>
            </Link>
            <Link href="/editVotablePools">
              <Button>Edit votable Pools</Button>
            </Link>
          </HStack>
        </Card>
        <Card m={6}>
          <CardHeader>
            <Heading size="md">Add user</Heading>
          </CardHeader>
          <CardBody>
            <Box>
              <HStack gap={4}>
                <Text>Insert Github Username for admin user to add:</Text>
                <Input
                  width="auto"
                  type="text"
                  value={username}
                  onChange={event => setUsername(event.target.value)}
                />
                <Button disabled={username.length < 1} onClick={saveUsernameHandler}>
                  Add user
                </Button>
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
                <Input
                  width="auto"
                  type="text"
                  value={apikey}
                  onChange={event => setApikey(event.target.value)}
                />
                <Button disabled={apikey.length < 12} onClick={saveApikeyHandler}>
                  Add API key
                </Button>
              </HStack>
            </Box>
          </CardBody>
        </Card>
      </>
    );
  }
  return (
    <VStack m={20}>
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
    </VStack>
  );
};

export default Admin;
