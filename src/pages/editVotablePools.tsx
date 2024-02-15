// TODO: set votablePool.capMultiplier to 1.0 if not given by database/trpc
// TODO: add UI element to enter new capMultiplier either by input field (number) or by dropdown/radiobutton
//////////////////////////////////////
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
  Progress,
  Input,
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
    { enabled: !!requestedRound && !!session }
  ).data?.pools;
  const initPools = trpc.votepools.init.useMutation();
  const insertPools = trpc.votepools.insert.useMutation();

  const [pools, setPools] = useState(dbpools);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [capMultipliers, setCapMultipliers] = useState( !dbpools ? [''] : dbpools.map(value => ''));

  useEffect(() => {
    setPools(dbpools );
    setCapMultipliers(!dbpools ? [''] : dbpools.map((value) => 
    { const returnValue =!value.capMultiplier ? '' : value.capMultiplier.toString();
      return returnValue;
      }))
  }, [requestedRound, dbpools]);

  const handleCheckboxChange = (index: number, isChecked: boolean) => {
    const votablePools = !pools ? [] : [...pools];
    const multipliers = !capMultipliers ? [] : [...capMultipliers];
    (votablePools[index] as VotablePool).isUncapped = isChecked;
    if(isChecked)
    {
      (votablePools[index] as VotablePool).capMultiplier = undefined;
      multipliers[index] = ''
      setCapMultipliers(multipliers);
    }
    setPools(votablePools);
  };

  const handleInputChange = (index: number, value: string) => {
    const votablePools = !pools ? [] : [...pools];
    const multipliers = !capMultipliers ? [] : [...capMultipliers];
    (votablePools[index] as VotablePool).capMultiplier = Number(value);
    multipliers[index] = value;
    setCapMultipliers(multipliers);
    setPools(votablePools);
  };


  const handleSubmit = (event: React.FormEvent) => {
    //fix null values in pools from dbpools
    const fixedPools = !pools ? [] : pools?.map((pool, index) => {return !pool.capMultiplier ? {...pool, capMultiplier: Number(capMultipliers[index])} : pool}) 
    event.preventDefault();
    pools && insertPools.mutate(fixedPools);
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
    if (!dbpools)
      return (
        <>
          <AdminNav />
          <Progress size="xs" isIndeterminate />
        </>
      );
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
                <Th w={150}>Multiplier</Th>
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
                    <Td>
                      <FormControl>
                        <Input type="number" value={capMultipliers[index]} disabled={votablePool.isUncapped} 
                        onChange={e => handleInputChange(index, e.target.value)}/>
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
