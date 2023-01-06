import { type NextPage } from "next";
import { Button } from "@chakra-ui/react";
import { useSession, signIn, signOut } from "next-auth/react";
import { trpc } from "../utils/trpc";

const BribeForm: NextPage = () => {
  const { data: session } = useSession();
  const userlist = trpc.login.list.useQuery().data?.userlist ?? [] // array to compare

  // // do this on any event (button click, ...)
  // const newUser = "Onkeljoe"; // example
  // trpc.login.addUser.useMutation().mutate({key: newUser});

  if (session) {
    return (
      <>
        Signed in as {session?.user?.email} - {session?.user?.name}
        <br />
        <Button onClick={() => signOut()}>Sign out</Button>
        {/* <p>{userlist.toString()}</p> */}
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
