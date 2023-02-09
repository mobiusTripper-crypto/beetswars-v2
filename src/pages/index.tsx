import type { NextPage } from "next";
import { ErrorBoundary } from "react-error-boundary";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useGlobalContext } from "contexts/GlobalContext";
import { useVoteState } from "hooks/useVoteState";
import { Box, Grid, Progress, Center, Text } from "@chakra-ui/react";
import { SplashItem } from "components/SplashItem";
import { CgCardSpades as CardIcon } from "react-icons/cg";
import { FaCoins as BribersIcon } from "react-icons/fa";
import { ImStatsBars as StatsIcon, ImTable as TableIcon } from "react-icons/im";
import { BiLineChart as ChartIcon } from "react-icons/bi";

const Home: NextPage = () => {
  const { requestedRound } = useGlobalContext();
  const router = useRouter();

  const { data: voteStateActive, loaded: stateLoaded } = useVoteState();

  useEffect(() => {
    if (stateLoaded) {
      if (voteStateActive) {
        console.log("vote active:", voteStateActive);
      } else {
        console.log("vote inactive:", voteStateActive);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voteStateActive, stateLoaded]);

  /*
  if (!stateLoaded) {
    return (
      <>
          <Progress size="xs" isIndeterminate />
          <Center>
            <Text fontSize="2xl">Init .... </Text>
          </Center>
      </>
    );
  }

*/

  return (
    <>
      <Box height="2px">{stateLoaded ? "" : <Progress size="xs" isIndeterminate />}</Box>
      <Center>
        <Grid margin="2rem" templateColumns="repeat(2, 1fr)" gap={6}>
          <SplashItem
            href="/round/0/cards"
            icon={CardIcon}
            text="Voter Dashboard"
            caption="main dashboard "
          />
          <SplashItem
            href="/chart"
            icon={ChartIcon}
            text="Gauge Vote History"
            caption="history of previous rounds"
          />
          <SplashItem
            href="#"
            icon={BribersIcon}
            text="Briber Dashboard"
            caption="coming soon ..."
          />
          <SplashItem href="#" icon={StatsIcon} text="W Da F" caption="coming soon ..." />
        </Grid>
      </Center>
    </>
  );
};

export default Home;

/*
// function ErrorFallback({ error }: { error: any }) {
function ErrorFallback({ error }: { error: Error }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: "red" }}>{error.message}</pre>
    </div>
  );
}
*/
