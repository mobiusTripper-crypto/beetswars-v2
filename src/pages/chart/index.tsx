import { type NextPage } from "next";
import { trpc } from "../../utils/trpc";
import { HStack, Text } from "@chakra-ui/react";

const Chart: NextPage = () => {
  const data = trpc.chart.chartdata.useQuery().data?.chartdata ?? "";

  if (!data) {
    return <p>Loading...</p>;
  }





  return (
    <div>
      <p>{JSON.stringify(data)}</p>
    </div>
  );
};

export default Chart;
