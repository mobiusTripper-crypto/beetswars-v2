import { useQuery } from "@tanstack/react-query";
import { type NextPage } from "next";
import { Box, HStack, Text, Center } from "@chakra-ui/react";


async function fetchChartData() {
  const res = await fetch("/api/v1/chartdata");
  return res.json();
}

export const TestPage: NextPage = () => {
  const {
    data: chartdata,
    status,
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["chart"],
    queryFn: fetchChartData,
    refetchInterval: false,
    refetchOnWindowFocus: false,
  });

  console.log(status);

  if (isLoading) {
    return <Center>Loading...</Center>;
  }

  if (error) {
    return (
      <Center>
        <pre style={{ color: "red" }}>Error</pre>
      </Center>
    );
  }

  return (
    <>
      {isFetching ? <div>Refreshing...</div> : null}
      <HStack justify="center">
        <div>
          {chartdata.map((chart: any, i: any) => (
            <pre key={i}>
              {i} - {chart.round} : {chart.voteEnd}
            </pre>
          ))}
        </div>
      </HStack>
    </>
  );
};
