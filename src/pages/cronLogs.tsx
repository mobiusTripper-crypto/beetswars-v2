import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import {
  Text,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Card,
  HStack,
  VStack,
  Progress,
} from "@chakra-ui/react";
import { trpc } from "utils/trpc";
import { useEffect } from "react";
import Router from "next/router";
import AdminNav from "components/AdminNav";

const CronLogs: NextPage = () => {
  const { data: session, status } = useSession();
  useEffect(() => {
    if (!session) Router.push("/admin");
  });

  const cronlogs = trpc.cronlogs.list.useQuery(undefined, { enabled: !!session }).data?.entries;

  if (session && status === "authenticated") {
    if (!cronlogs)
      return (
        <>
          <AdminNav />
          <Progress size="xs" isIndeterminate />
        </>
      );
    return (
      <VStack maxW={800} mx="auto" align="center" justifyContent="center">
        <AdminNav />
        <Card m={6} p={6}>
          <Table variant="striped" colorScheme="teal" size="sm">
            <Thead>
              <Tr>
                <Th>Job Name</Th>
                <Th>Date-Time</Th>
                <Th>Timestamp</Th>
              </Tr>
            </Thead>
            <Tbody>
              {cronlogs &&
                cronlogs.map((entry, index) => (
                  <Tr key={index}>
                    <Td>{entry.jobName}</Td>
                    <Td>{entry.dateReadable}</Td>
                    <Td>{entry.timestamp}</Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </Card>
      </VStack>
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

export default CronLogs;
