import { type NextPage } from "next";
import { Button, Grid, GridItem, HStack, Text, VStack } from "@chakra-ui/react";
import { useSession, signIn, signOut } from "next-auth/react";
import { trpc } from "../utils/trpc";

const Round: NextPage = () => {
  // const { data: session, status } = useSession();
  // const bribeList = trpc.bribes.list.useQuery().data?.bribeList; // array to compare
  let round = 26; // get from dropdown? store in session or global context?
  const bribefile = trpc.bribedata.bribedata.useQuery().data?.bribefile;
  // for subpage with round put {round} in the Query:
  // const bribefile = trpc.bribedata.bribedata.useQuery({round}).data?.bribefile;
  const bribedata = bribefile?.bribelist ?? []
  const header = bribefile?.header ?? null

  // if (session && status === "authenticated") {
    return (
      <>
      <h2><b>header:</b></h2>
        <p>
          {JSON.stringify(header)}
        </p>
        <>
        <h2><b>bribes:</b></h2>
        { bribedata.map((bribe) =>  (
          <>
          <p>
            {JSON.stringify(bribe)}
          </p>
          <p>--------------------------------</p>
          </>
        ))

        }
        </>
      </>
    );
  }
  
  // use with session:
  ////////////////////

//   return (
//     <VStack>
//       <HStack>
//         <Text>Not signed in</Text>
//         <Button
//           onClick={() =>
//             //I think setting callbackUrl will do dynamic redirect, but not working just yet. so we can have just a single OAuth Github app
//             //signIn("GitHubProvider", {callbackUrl: "http://localhost:3000/api/auth/callback/github",})
//             signIn()
//           }
//         >
//           Sign in
//         </Button>
//       </HStack>
//     </VStack>
//   );
// };

export default Round;
