import { useQuery } from "@tanstack/react-query";
import { type NextPage } from "next";
import { Box, HStack, Text } from "@chakra-ui/react";

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
  } = useQuery({
    queryKey: ["chart"],
    queryFn: fetchChartData,
    refetchInterval: false,
    refetchOnWindowFocus: true,
  });

  console.log(status);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {isFetching ? <div>Refreshing...</div> : null}
      <HStack justify="center">
        <div>
          {chartdata.map((chart:any, i:any) => (
            <pre>
              {i} - {chart.round} : {chart.voteEnd}
            </pre>
          ))}
        </div>
      </HStack>
    </>
  );
};

