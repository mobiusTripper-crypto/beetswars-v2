import { type NextPage } from "next";
import { Button, Text } from "@chakra-ui/react";
import { useSession, signIn, signOut } from "next-auth/react";

const BribeForm: NextPage = () => {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        Signed in as {session?.user?.email} <br />
        <Button onClick={() => signOut()}>Sign out</Button>
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <Button onClick={() => signIn()}>Sign in</Button>
    </>
  );
};

export default BribeForm;
