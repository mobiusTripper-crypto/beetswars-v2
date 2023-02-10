import type { VotablePool } from "types/votablePools.raw";
import { type NextPage } from "next";
import { useSession, signIn, signOut } from "next-auth/react";
import {
  Text,
  Checkbox,
  Table,
  FormControl,
  Button,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Card,
} from "@chakra-ui/react";
import { HStack, VStack } from "@chakra-ui/react";
import { trpc } from "utils/trpc";
import { useGlobalContext } from "contexts/GlobalContext";
import RoundSelector from "components/RoundSelector";

const VotablePoolForm: NextPage = () => {
  const { requestedRound, requestRound } = useGlobalContext();
  const pools =
    trpc.votepools.list.useQuery({ round: requestedRound }).data?.pools || ([] as VotablePool[]);
  const initPools = trpc.votepools.init.useMutation();
  const insertPools = trpc.votepools.insert.useMutation();

  // const [pools, setPools] = useState(votablePools);
  const { data: session, status } = useSession();

  const handleCheckboxChange = (index: number, checked: boolean) => {
    const votablePools = [...pools];
    (votablePools[index] as VotablePool).isUncapped = checked;
    // setPools(votablePools);
  };
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    insertPools.mutate(pools);
  };
  const changeRound = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRound = parseInt(e.target.value);
    requestRound(newRound);
  };

  if (session && status === "authenticated") {
    return (
      <>
        <HStack m={6} justifyContent="flex-end">
          <Text>Signed in as {session?.user?.name}</Text>
          <Button onClick={() => signOut()}>Sign out</Button>
        </HStack>
        <Card m={6}>
          <Table variant="striped" colorScheme="teal" size="sm">
            <Thead>
              <Tr>
                <Th>Pool Name</Th>
                <Th>Vote Index</Th>
                <Th>Round</Th>
                <Th>Is Uncapped</Th>
              </Tr>
            </Thead>
            <Tbody>
              {pools.map((votablePool, index) => (
                <Tr key={index}>
                  <Td>{votablePool.poolName}</Td>
                  <Td>{votablePool.voteindex}</Td>
                  <Td>{votablePool.round}</Td>
                  <Td>
                    <FormControl>
                      <Checkbox
                        id={`isUncapped-${index}`}
                        name={`isUncapped-${index}`}
                        isChecked={votablePool.isUncapped}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                          handleCheckboxChange(index, event.target.checked)
                        }
                      />
                    </FormControl>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          <HStack>
            <Button mt={14} m={6} onClick={handleSubmit}>
              Submit
            </Button>
          </HStack>
        </Card>
        <Card m={6}>
          <HStack m={6}>
            <Text>select round</Text>
            <RoundSelector handleChange={changeRound} />
            <Button m={6} onClick={() => initPools.mutate(requestedRound)}>
              initial fill for Round {requestedRound}
            </Button>
          </HStack>
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

export default VotablePoolForm;
