import type { VotablePool } from "types/votablePools.raw";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
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
  useToast,
} from "@chakra-ui/react";
import { HStack, VStack } from "@chakra-ui/react";
import { trpc } from "utils/trpc";
import { useGlobalContext } from "contexts/GlobalContext";
import { useEffect, useState } from "react";
import Router from "next/router";
import AdminNav from "components/AdminNav";

const VotablePoolForm: NextPage = () => {

  const { data: session, status } = useSession();
  useEffect(() => {
    if (!session) Router.push("/admin");
  });
  const { requestedRound } = useGlobalContext();


  const dbpools = trpc.votepools.list.useQuery(
    { round: requestedRound as number },
    { enabled: !!requestedRound && !!session}
  ).data?.pools;
  const initPools = trpc.votepools.init.useMutation();
  const insertPools = trpc.votepools.insert.useMutation();

  const [pools, setPools] = useState(dbpools);

  useEffect(() => {
    setPools(dbpools);
  }, [requestedRound, dbpools]);

  const handleCheckboxChange = (index: number, isChecked: boolean) => {
    const votablePools = !pools ? [] : [...pools];
    (votablePools[index] as VotablePool).isUncapped = isChecked;
    setPools(votablePools);
  };
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    pools && insertPools.mutate(pools);
    showToast();
  };
  const toast = useToast();
  function showToast() {
    toast({
      title: "Data submitted.",
      description: "data successfully sent to database",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  }

  if (session && status === "authenticated") {
    return (
      <>
        <AdminNav />
        <Card m={6} p={6}>
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
              {pools &&
                pools.map((votablePool, index) => (
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
          <Button m={6} onClick={() => initPools.mutate(requestedRound as number)}>
            initial fill for Round {requestedRound}
          </Button>
        </Card>
      </>
    );
  }
  return (
    <VStack>
      <HStack>
        <Text>Not signed in</Text>
      </HStack>
    </VStack>
  );
};

export default VotablePoolForm;
