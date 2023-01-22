import type { NextPage } from "next";
import type { Echarts } from "types/echarts.trpc";
import { trpc } from "utils/trpc";
import ReactECharts from "echarts-for-react";
import { useGlobalContext } from "contexts/GlobalContext";
import { HStack, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";

const voteActive: boolean | undefined = true;
const REFRESH_INTERVAL = (voteActive: boolean) =>
  voteActive === true ? 60000 : 0;

const RefetchOptions = {
  refetchOnWindowFocus: false,
  refetchIntervalInBackground: false,
  refetchInterval: 0,
};

function Chart1() {
  const chartData: Echarts | "" =
    trpc.chart.chartdata.useQuery( undefined, RefetchOptions ).data?.chartdata ?? "";
  const { requestedRound, requestRound } = useGlobalContext();
  const router = useRouter();
  const linewidth = "2";
  const opacity = "0.04";
  const areastyle = { opacity: opacity };

  const option = {
    color: [
      "magenta",
      "cyan",
      "cornflowerblue",
      "orange",
      "red",
      "white",
      "yellow",
      "lime",
      "green",
      "grey",
    ],
    textStyle: {
      color: "#ffffff",
    },

    title: {
      textStyle: {
        color: "#ffffff",
      },
      subtextStyle: {
        color: "#fefefe",
      },
      // text: "Round 04 - " + (numRounds),
      left: "center",
    },

    tooltip: {
      trigger: "axis",
      padding: 7,
      backgroundColor: "#FFFFFFEE",
      formatter: (args: any) => {
        //console.log(args);
        let tooltip = `<p align='center'><b>${args[0].axisValue} - 
                        ${args[1].axisValue}</b></p>
                          <table> `;

        args.forEach((item: any) => {
          tooltip += `<tr><td>${item.marker}</td><td> ${item.seriesName}:</td><td align='right'> 
            ${item.value}</td></tr>`;
        });
        tooltip += `</table>`;

        return tooltip;
      },
    },

    axisPointer: {
      link: { xAxisIndex: "all" },
      label: { show: false },
    },

    grid: [
      {
        // index 0  top
        show: false,
        height: "300",
        left: "15%",
        right: "15%",
        // top: "60",
      },
      {
        // index 1 middle
        show: false,
        height: "300",
        left: "15%",
        right: "15%",
        top: "430",
      },
      {
        // index 2  bottom
        show: false,
        height: "300",
        left: "15%",
        right: "15%",
        top: "810",
      },
    ],

    xAxis: [
      {
        // offers
        type: "category",
        boundaryGap: false,
        axisLine: { onZero: true },
        // @ts-ignore
        data: chartData.rounds as string[],
        gridIndex: 0,
        show: false,
        triggerEvent: true,
        axisTick: { show: false },
      },
      {
        // bribes
        type: "category",
        boundaryGap: false,
        axisLine: { onZero: true },
        // @ts-ignore
        data: chartData.endTime,
        gridIndex: 0,
        show: false,
        triggerEvent: true,
      },
      {
        // bribeApr
        type: "category",
        boundaryGap: false,
        axisLine: { onZero: true },
        // @ts-ignore
        data: chartData.endTime,
        gridIndex: 0,
        show: false,
        triggerEvent: true,
      },
      {
        // avg1000
        type: "category",
        boundaryGap: false,
        axisLine: { onZero: true },
        // @ts-ignore
        data: chartData.rounds,
        gridIndex: 1,
        offset: 20,
        show: false,
        triggerEvent: true,
      },
      {
        // beets price
        type: "category",
        boundaryGap: false,
        axisLine: { onZero: true },
        // @ts-ignore
        data: chartData.endTime,
        gridIndex: 1,
        show: false,
        offset: 20,
        triggerEvent: true,
      },
      {
        // voting apr
        type: "category",
        boundaryGap: false,
        axisLine: { onZero: true },
        //data: rounds,
        gridIndex: 1,
        show: false,
        offset: 20,
        triggerEvent: true,
      },
      {
        // voter
        type: "category",
        boundaryGap: false,
        axisLine: { onZero: true },
        // @ts-ignore
        data: chartData.rounds,
        gridIndex: 2,
        show: true,
        offset: 10,
        position: "bottom",
        triggerEvent: true,
      },
      {
        // votes
        type: "category",
        boundaryGap: false,
        axisLine: { onZero: true },
        // @ts-ignore
        data: chartData.endTime,
        gridIndex: 2,
        show: true,
        offset: 30,
        position: "bottom",
        triggerEvent: true,
      },
      {
        // bribed votes
        type: "category",
        boundaryGap: false,
        axisLine: { onZero: true },
        // @ts-ignore
        data: chartData.endTime,
        gridIndex: 2,
        show: false,
        offset: 30,
        triggerEvent: true,
      },
      {
        // bribed ratio
        type: "category",
        boundaryGap: false,
        axisLine: { onZero: true },
        // @ts-ignore
        data: chartData.endTime,
        gridIndex: 2,
        show: false,
        //offset: 20,
        triggerEvent: true,
      },
    ],

    yAxis: [
      {
        name: "Offers",
        nameTextStyle: { color: "magenta", fontSize: "0.9em" },
        type: "value",
        splitLine: { lineStyle: { type: "dotted", color: "#55555500" } },
        gridIndex: 0,
        position: "right",
        axisLabel: { color: "magenta", align: "left" },
        axisTick: { show: false },
        offset: 1,
      },
      {
        name: "Total Incentives $",
        nameTextStyle: { color: "cyan", fontSize: "0.9em" },
        type: "log",
        splitLine: { lineStyle: { type: "dotted", color: "#555555" } },
        axisLabel: { color: "cyan", align: "right" },
        gridIndex: 0,
        max: 1200000,
      },
      {
        name: "Bribers Roi %",
        nameTextStyle: { color: "cornflowerblue", fontSize: "0.9em" },
        type: "value",
        splitLine: { lineStyle: { type: "dotted", color: "#555555" } },
        axisLabel: { color: "cornflowerblue", align: "left" },
        gridIndex: 0,
        position: "right",
        nameLocation: "start",
        offset: 23,
      },
      {
        name: "Avg $/1000 fB",
        nameTextStyle: { color: "orange", fontSize: "0.9em" },
        type: "log",
        splitLine: { lineStyle: { type: "dotted", color: "#55555500" } },
        gridIndex: 1,
        position: "right",
        axisLabel: { color: "orange", align: "left" },
        offset: 43,
      },
      {
        name: "Beets Price $",
        nameTextStyle: { color: "red", fontSize: "0.9em" },
        type: "log",
        splitLine: { lineStyle: { type: "dotted", color: "#555555" } },
        gridIndex: 1,
        position: "left",
        axisLabel: { color: "red", align: "right" },
      },
      {
        name: "Voting APR %",
        nameTextStyle: { color: "white", fontSize: "0.9em" },
        type: "value",
        splitLine: { lineStyle: { type: "dotted", color: "#55555500" } },
        gridIndex: 1,
        position: "right",
        axisLabel: { color: "white", align: "left" },
        nameLocation: "start",
      },
      {
        name: "Total Voter",
        nameTextStyle: { color: "yellow", fontSize: "0.9em" },
        type: "value",
        splitLine: { lineStyle: { type: "dotted", color: "#55555500" } },
        gridIndex: 2,
        axisLabel: { color: "yellow", align: "left" },
        position: "right",
      },
      {
        name: "Total Votes - Incentivised Votes",
        type: "value",
        nameTextStyle: { color: "lime", fontSize: "0.9em" },
        splitLine: { lineStyle: { type: "dotted", color: "#555555" } },
        gridIndex: 2,
        axisLabel: { color: "lime", align: "right" },
        position: "left",
        max: 70000000,
      },
      {
        name: "Incentivised Votes",
        nameTextStyle: { color: "green", fontSize: "0.9em" },
        type: "value",
        splitLine: { lineStyle: { type: "dotted", color: "#55555500" } },
        gridIndex: 2,
        position: "right",
        axisLabel: { color: "green", align: "left" },
        nameLocation: "start",
        show: false,
        max: 70000000,
      },
      {
        name: "Incentivised Votes Ratio",
        nameTextStyle: { color: "grey", fontSize: "0.9em" },
        type: "value",
        splitLine: { lineStyle: { type: "dotted", color: "#55555500" } },
        gridIndex: 2,
        position: "right",
        axisLabel: { color: "grey", align: "left" },
        nameLocation: "start",
        show: false,
      },
    ],

    series: [
      {
        animation: false,
        name: "Offers",
        type: "line",
        symbolSize: 3,
        showSymbol: false,
        smooth: "true",
        stack: "",
        areaStyle: { opacity: opacity },
        lineStyle: { color: "magenta", width: linewidth },
        // @ts-ignore
        data: chartData.totalOffers,
        xAxisIndex: 0,
        yAxisIndex: 0,
      },
      {
        animation: false,
        animationDuration: 2000,
        name: "Total Incentives $",
        type: "line",
        symbolSize: 3,
        showSymbol: false,
        smooth: "true",
        stack: "",
        areaStyle: { opacity: opacity },
        lineStyle: { color: "cyan", width: linewidth },
        // @ts-ignore
        data: chartData.totalBribes,
        xAxisIndex: 1,
        yAxisIndex: 1,
      },
      {
        name: "Bribers Roi %",
        type: "line",
        symbolSize: 3,
        showSymbol: false,
        smooth: "true",
        stack: "",
        areaStyle: { opacity: opacity },
        lineStyle: { color: "cornflowerblue", width: linewidth },
        // @ts-ignore
        data: chartData.bribersRoi,
        xAxisIndex: 2,
        yAxisIndex: 2,
      },
      {
        animation: false,
        name: "Avg $/1000 fB",
        type: "line",
        symbolSize: 3,
        showSymbol: false,
        smooth: "true",
        stack: "",
        areaStyle: { opacity: opacity },
        lineStyle: { color: "orange", width: linewidth },
        // @ts-ignore
        data: chartData.avgPer1000,
        xAxisIndex: 3,
        yAxisIndex: 3,
      },
      {
        animation: false,
        name: "Beets Price $",
        type: "line",
        symbolSize: 3,
        showSymbol: false,
        smooth: "true",
        stack: "",
        areaStyle: { opacity: opacity },
        lineStyle: { color: "red", width: linewidth },
        // @ts-ignore
        data: chartData.priceBeets,
        xAxisIndex: 4,
        yAxisIndex: 4,
      },
      {
        animation: false,
        name: "Voting APR %",
        type: "line",
        symbolSize: 3,
        showSymbol: false,
        smooth: "true",
        stack: "",
        areaStyle: { opacity: opacity },
        lineStyle: { color: "white", width: linewidth },
        // @ts-ignore
        data: chartData.votingApr,
        xAxisIndex: 5,
        yAxisIndex: 5,
      },
      {
        animation: false,
        name: "Total Voter",
        type: "line",
        symbolSize: 3,
        showSymbol: false,
        smooth: "true",
        stack: "",
        areaStyle: { opacity: opacity },
        lineStyle: { color: "yellow", width: linewidth },
        // @ts-ignore
        data: chartData.totalVoter,
        xAxisIndex: 6,
        yAxisIndex: 6,
      },
      {
        animation: false,
        name: "Total Votes",
        type: "line",
        symbolSize: 3,
        showSymbol: false,
        smooth: "true",
        stack: "",
        areaStyle: areastyle,
        lineStyle: { color: "lime", width: linewidth },
        // @ts-ignore
        data: chartData.totalVotes,
        xAxisIndex: 7,
        yAxisIndex: 7,
      },
      {
        animation: false,
        name: "Incentivised Votes",
        type: "line",
        symbolSize: 3,
        showSymbol: false,
        smooth: "true",
        stack: "",
        areaStyle: { opacity: opacity },
        lineStyle: { color: "green", width: linewidth },
        // @ts-ignore
        data: chartData.bribedVotes,
        xAxisIndex: 8,
        yAxisIndex: 8,
      },
      {
        animation: false,
        name: "Incentivised Votes Ratio %",
        type: "bar",
        showSymbol: false,
        itemStyle: { opacity: 0.0 },
        // @ts-ignore
        data: chartData.bribedVotesRatio,
        xAxisIndex: 9,
        yAxisIndex: 9,
      },
    ],
  };

  const onChartClick = (params: any) => {
    const offset = 1;

    if (params.dataIndex > 2) {
      let requestedRound = params.dataIndex + offset;
      requestedRound =
        requestedRound < 10 ? "0" + requestedRound : requestedRound;
      requestRound(requestedRound);
      console.log("click", params.dataIndex, "->", "request " + requestedRound);

      const roundPage = "/round/" + requestedRound;

      router.push(roundPage);
    }
  };

  const onEvents = {
    click: onChartClick,
  };

  if (!chartData) {
    return (
      <>
        <Text variant="body2" align="center">
          Chart loading ...
        </Text>
      </>
    );
  }

  return (
    <>
      <Text fontSize="3xl"  align="center" marginBottom="20px">
        Gauge Vote History
      </Text>
      <ReactECharts
        option={option}
        onEvents={onEvents}
        style={{ height: 1200 }}
      />
      <Text variant="body2" align="center">
        (clicking on data points loads historical pages)
      </Text>
    </>
  );
}

export default Chart1;
