/// WIP - ignore :-)

import { useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import { Progress, Center, Text } from "@chakra-ui/react";
import { ethers } from "ethers";
import { request, gql } from "graphql-request";
import { useQuery, useQueries } from "@tanstack/react-query";
import { useGlobalContext } from "contexts/GlobalContext";

const GAUGE_VOTES = gql`
  query Proposals {
    proposals(
      first: 300
      skip: 0
      where: { space_in: ["beets.eth"], title_contains: "Farming Incentive Gauge Vote" }
      orderBy: "created"
      orderDirection: asc
    ) {
      id
      title
      start
      snapshot
    }
  }
`;
/*
const BEETS_PROPOSALS = gql`
  query Proposals {
    proposals(
      first: 300
      skip: 0
      where: { space_in: ["beets.eth"] }
      orderBy: "created"
      orderDirection: asc
    ) {
      id
      title
      start
      snapshot
    }
  }
`;
*/

const url = "https://hub.snapshot.org/graphql";
const blockTime: any = [];
const snapshots: any = [];
const roundStart: any = [];

function App() {
  const regex_gaugevote = new RegExp("Farming Incentive Gauge Vote");

  const { requestedRound } = useGlobalContext();
  const [allLoaded, setAllLoaded] = useState(false);
  const [blocksReady, setBlocksReady] = useState(false);
  const provider = new ethers.providers.JsonRpcProvider("https://rpc.ftm.tools");

  async function fetchG() {
    const sData = await request(url, GAUGE_VOTES);
    if (!sData) {
      console.error("proposal request failed");
      return 0;
    } else {
    }
    return sData;
  }

  const { data: proposalsData, isSuccess: propSuccess } = useQuery({
    queryKey: ["wdaf_proposals"],
    queryFn: fetchG,
    refetchOnWindowFocus: false,
    refetchInterval: 0,
    staleTime: Infinity,
  });

  /*
  const fetchBlocks = async () => {
    // reset array
    blockTime.length = 0;
    await Promise.all(
      snapshots.map(async (block: string, index: number) => {
        const res = await provider.getBlock(parseInt(block));
        blockTime.push(res.timestamp);
        return index;
      })
    );
    setBlocksReady(true);
  };
*/

  async function fetchB(block: string) {
    const res = await provider.getBlock(parseInt(block));
    //console.log(res.timestamp);
    return res.timestamp;
  }

  const blocks2 = useQueries({
    queries: (snapshots || []).map((block: string, index: number) => ({
      queryKey: ["block", index, block],
      queryFn: () => fetchB(block),
      refetchInterval: 0,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      cacheTime: Infinity,
      enabled: !!propSuccess,
    })),
  });

  useEffect(() => {
    // console.log(proposalsData);
    if (propSuccess) {
      // reset arrays
      snapshots.length = 0;
      roundStart.length = 0;
      proposalsData.proposals.map((proposal: any) => {
        if (regex_gaugevote.test(proposal.title)) {
          //         console.log(proposal.snapshot);
          snapshots.push(proposal.snapshot);
          roundStart.push(proposal.start);
        }
      });
      //  fetchBlocks();
      setAllLoaded(true);
    } else {
      setAllLoaded(false);
    }
  }, [propSuccess, proposalsData]);

  useEffect(() => {
    // console.log(blocks2);
    let success = true;
    if (blocks2) {
      blockTime.length = 0;
      blocks2.map((block: any) => {
        if (!block.isSuccess) {
          success = false;
        }
      });
      if (success) {
        blocks2.map((block: any) => {
          blockTime.push(block.data);
          setBlocksReady(true);
        });
      }
    }
  }, [blocks2]);

  if (!allLoaded && !blocksReady) {
    return <Progress size="xs" isIndeterminate />;
  } else {
    return (
      <>
        <Center>
          <Text fontSize="3xl" margin="20px">
            time before gauge vote start snapshot was taken
          </Text>
        </Center>
        <ChartSnapTimes
          blockTime={blockTime}
          snapshots={snapshots}
          roundStart={roundStart}
          requestedRound={requestedRound}
        />
        ;
      </>
    );
  }
}

interface ChartProps {
  blockTime: number[];
  snapshots: string[];
  roundStart: number[];
  requestedRound: number | undefined;
}

function ChartSnapTimes(props: ChartProps) {
  console.log(props);

  //  const blockTimeS = props.blockTime.sort();
  const diffs = props.snapshots.map((sn: string, index: number) => {
    return (roundStart[index] - blockTime[index]) * 1000;
  });
  //  const difflabel = props.snapshots.map((sn: string, index: number) => {
  //    return timeSince((roundStart[index] - blockTime[index]) * 1000);
  //  });
  //console.log(diffs);
  const rounds = props.roundStart.map(function (round: number, index: number) {
    return "R" + (index + 1);
  });

/*
  const rounds2 = props.roundStart.map(function (round: number, index: number) {
    if (index + 1 === props.requestedRound) {
      return 1;
    } else return 0;
  });
  console.log(rounds2);
*/

  const option = {
    title: {
      //      textStyle: { color: "#eeeeee" },
    },
    tooltip: {
      trigger: "axis",
      padding: 5,
      valueFormatter: (value: number) => timeSince(value),
    },
    xAxis: {
      type: "category",
      //data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      data: rounds,
    },
    yAxis: {
      name: "Hours",
      type: "value",
      nameTextStyle: { fontSize: "1em" },
      splitLine: { lineStyle: { type: "dotted", color: "#F57EFF55" } },
      axisLabel: {
        formatter: (value: number) => hoursSince(value),
      },
    },
    series: [
      {
        data: diffs,
        type: "bar",
      },
    ],
  };
  return (
    <ReactECharts
      option={option}
      style={{ margin: "auto", maxWidth: 900, height: 500, marginTop: 30 }}
    />
  );
}

function hoursSince(diff: number) {
  const hours = Math.floor(diff / (1000 * 60 * 60));
  return hours;
}

function timeSince(diff: number) {
  let sgn = " ";
  diff < 0 ? (sgn = "+ ") : (sgn = "  ");
  let diffabs = Math.abs(diff);
  const days = Math.floor(diffabs / (1000 * 60 * 60 * 24));
  diffabs -= days * (1000 * 60 * 60 * 24);
  const hours = Math.floor(diffabs / (1000 * 60 * 60));
  diffabs -= hours * (1000 * 60 * 60);
  const mins = Math.floor(diffabs / (1000 * 60));
  diffabs -= mins * (1000 * 60);
  const seconds = Math.floor(diffabs / 1000);
  diffabs -= seconds * 1000;
  return sgn + days + "d " + hours + "h " + mins + "m " + seconds + "s";
}

export default App;
