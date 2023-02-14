// TODO: if vote active probably redirect -> /round/{roundList.latest}
//import { useRouter } from "next/router";
import type { NextPage } from "next";
import { useEffect } from "react";
import { useGlobalContext } from "contexts/GlobalContext";
import { useVoteState } from "hooks/useVoteState";
import { SimpleGrid, Box, Progress, Center } from "@chakra-ui/react";
import { SplashItem } from "components/SplashItem";
import { CgCardSpades as CardIcon } from "react-icons/cg";
import { FaCoins as BribersIcon } from "react-icons/fa";
import { ImStatsBars as StatsIcon } from "react-icons/im";
// import { ImStatsBars as StatsIcon, ImTable as TableIcon } from "react-icons/im";
import { BiLineChart as ChartIcon } from "react-icons/bi";
import { useRoundList } from "hooks/useRoundList";

const Home: NextPage = () => {
  const { data: roundList, loaded: roundsLoaded } = useRoundList();
  // const { requestedRound, display } = useGlobalContext();
  const { display } = useGlobalContext();
  const { data: voteStateActive, loaded: stateLoaded } = useVoteState();

  console.log("vote active state:", voteStateActive);
  return (
    <>
      <Box height="2px">
        {stateLoaded && roundsLoaded ? "" : <Progress size="xs" isIndeterminate />}
      </Box>
      <Center>
        <SimpleGrid columns={[1, null, 2]} spacing={6} mt={6}>
          <SplashItem
            href={`/round/${roundList?.latest}/${display}`}
            icon={CardIcon}
            text="Voter Dashboard"
            caption={`Main Dashboard (${roundList?.latest})`}
          />
          <SplashItem
            href="/bribersDashboard"
            icon={BribersIcon}
            text="Briber Dashboard"
            caption="coming soon ..."
          />
          <SplashItem
            href="/chart"
            icon={ChartIcon}
            text="Gauge Vote History"
            caption="History of previous rounds"
          />
          <SplashItem
            href="/snapshotTimes"
            icon={StatsIcon}
            text="Snapshot Times"
            caption="coming soon ..."
          />
        </SimpleGrid>
      </Center>
    </>
  );
};

export default Home;
