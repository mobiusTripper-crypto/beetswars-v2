/* eslint-disable ban-ts-comment */

import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Wrap,
  HStack,
  VStack,
  SimpleGrid,
  Heading,
  Button,
  Text,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Box,
  Center,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useGlobalContext } from "contexts/GlobalContext";
import { trpc } from "utils/trpc";

async function fetchRoundData(url: string) {
  console.log(url);
  const res = await fetch(url || "");
  return res.json();
}

export default function Round() {
  const roundList = trpc.rounds.roundlist.useQuery(undefined, {
    refetchOnWindowFocus: false,
  }).data?.data ?? {
    rounds: [],
    latest: 0,
  };

  const { requestedRound, requestRound, display, setDisplay } =
    useGlobalContext();
  const router = useRouter();
  const number = (router.query.number as string[]) || [];

  useEffect(() => {
    // @ts-ignore
    if (!roundList.rounds.includes(number[0])) {
      requestRound(roundList.latest.toString());
      router.push("/round/" + requestedRound, undefined, { shallow: true });
    } else {
      // @ts-ignore
      requestRound(number[0]);
    }
  }, [roundList, number]);

  const Url = "/api/v1/bribedata/" + requestedRound;

  if (number[1]) {
    switch (number[1]) {
      case "table":
        setDisplay("table");
        break;
      default:
        setDisplay("cards");
    }
  }

  console.log(roundList.latest);
  console.log(number[0], requestedRound);

  const { data: bribedata, isLoading } = useQuery(["bribedata", Url], () =>
    fetchRoundData(Url)
  );

  if (isLoading) {
    return <Center>Loading ... </Center>;
  }

  return (
    <>
      <Center>
        <Box>
          <pre>
            Round {requestedRound} -- <Link href={Url}>{Url}</Link>
          </pre>
        </Box>
      </Center>
      <Center>
        <Box>
          <pre>{bribedata?.version}</pre>
        </Box>
      </Center>
      {display === "cards" ? (
        <Center>
          <Wrap justify="center" padding="23px" margin="23px" spacing="50px">
            {bribedata?.bribedata?.map((bribe: any, i: number) => (
              <Box
                key={i}
                padding="23px"
                border="1px"
                margin="73px"
                width="200px"
                borderRadius="23px"
              >
                <Box>
                  <Box>
                    <Heading size="md">{bribe.poolname}</Heading>
                  </Box>
                  <Box>
                    <Text>{bribe.rewarddescription}</Text>
                    <Text>{bribe.assumption}</Text>
                  </Box>
                  <Box>
                    <Button>
                      <Link href={bribe.poolurl}>Pool Link</Link>
                    </Button>
                  </Box>
                </Box>
              </Box>
            ))}
          </Wrap>
        </Center>
      ) : (
        <Center>
          <TableContainer>
            <Table variant="striped">
              <Thead>
                <Tr>
                  <Th isNumeric>voteindex</Th>
                  <Th>poolname</Th>
                  <Th>description</Th>
                  <Th>Link</Th>
                </Tr>
              </Thead>
              <Tbody>
                {bribedata?.bribedata.map((bribe: any, i: number) => (
                  <Tr key={i}>
                    <Td isNumeric> {bribe.voteindex}</Td>
                    <Td>{bribe.poolname}</Td>
                    <Td>{bribe.rewarddescription}</Td>
                    <Td>
                      <Link href={bribe.poolurl}>link</Link>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Center>
      )}
    </>
  );
}
