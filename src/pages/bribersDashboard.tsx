import type { NextPage } from "next";
import { Box, Heading, Text, Progress, Grid, GridItem, Center } from "@chakra-ui/react";
import { trpc } from "utils/trpc";
import { useGlobalContext } from "contexts/GlobalContext";
import RoundSelector from "components/RoundSelector";
import { DashboardTemp } from "components/dashboardTemp";
import type { DashboardData } from "types/bribersDashboard.trpc";

const Dashboard: NextPage = () => {
  const { requestedRound, requestRound } = useGlobalContext();
  const data = trpc.dashboard.list.useQuery({ round: requestedRound }).data?.board as DashboardData;

  const changeRound = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value);
    requestRound(parseInt(e.target.value));
  };

  if (!data)
    return (
      <>
        <Box height="1px">
          <Progress size="xs" isIndeterminate />{" "}
        </Box>
        <Box m={6}>
          <Heading mt={6}>Loading ...</Heading>
          <Text>waiting for data round {requestedRound}</Text>
        </Box>
      </>
    );
  return (
    <Center mt={12}>
      <Grid templateColumns="200px 3fr">
        <GridItem w="100%" bg="black">
          <Box m={6}>
            <RoundSelector handleChange={changeRound} />
          </Box>
        </GridItem>
        <GridItem w="100%" bg="darkblue">
          <DashboardTemp data={data} requestedRound={requestedRound} />
        </GridItem>
      </Grid>
    </Center>
  );
};

export default Dashboard;
