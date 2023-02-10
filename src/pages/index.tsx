// TODO: if vote active probably redirect -> /round/{roundList.latest}
//import { useRouter } from "next/router";
import type { NextPage } from "next";
import { useEffect } from "react";
import { useGlobalContext } from "contexts/GlobalContext";
import { useVoteState } from "hooks/useVoteState";
import { Box, Grid, Progress, Center, Text } from "@chakra-ui/react";
import { SplashItem } from "components/SplashItem";
import { CgCardSpades as CardIcon } from "react-icons/cg";
import { FaCoins as BribersIcon } from "react-icons/fa";
import { ImStatsBars as StatsIcon, ImTable as TableIcon } from "react-icons/im";
import { BiLineChart as ChartIcon } from "react-icons/bi";
import { useRoundList } from "hooks/useRoundList";

const Home: NextPage = () => {
  //  const router = useRouter();

  const { data: roundList, loaded: roundsLoaded } = useRoundList();
  const { requestedRound, display } = useGlobalContext();
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

  return (
    <>
      <Box height="2px">
        {stateLoaded && roundsLoaded ? "" : <Progress size="xs" isIndeterminate />}
      </Box>
      <Center>
        <Grid margin="2rem" templateColumns="repeat(2, 1fr)" gap={6}>
          <SplashItem
            href={`/round/${roundList?.latest}/${display}`}
            icon={CardIcon}
            text="Voter Dashboard"
            caption={`Main Dashboard (${roundList?.latest})`}
          />
          <SplashItem
            href="/chart"
            icon={ChartIcon}
            text="Gauge Vote History"
            caption="History of previous rounds"
          />
          <SplashItem
            href="/bribersDashboard"
            icon={BribersIcon}
            text="Briber Dashboard"
            caption="coming soon ..."
          />
          <SplashItem href="#" icon={StatsIcon} text="W da F" caption="coming soon ..." />
        </Grid>
      </Center>
    </>
  );
};

export default Home;
