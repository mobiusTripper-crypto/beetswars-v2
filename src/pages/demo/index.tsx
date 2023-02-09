import {
  Progress,
  Center,
  Grid,
} from "@chakra-ui/react";
import Image from "next/image";
import { CgCardSpades as CardIcon } from "react-icons/cg";
import { FaCoins as BribersIcon } from "react-icons/fa";
import { ImStatsBars as StatsIcon, ImTable as TableIcon } from "react-icons/im";
import { BiLineChart as ChartIcon } from "react-icons/bi";
import pic1 from "../../../public/pic1.png";
import { SplashItem } from "components/SplashItem";

function ImG() {

  return (
    <>
      <Center>
        <Grid margin="2rem" templateColumns="repeat(2, 1fr)" gap={6}>
          <SplashItem href="/chart" icon={CardIcon} text="Voter Dashboard" caption="maybe some text here " />
          <SplashItem href="/chart" icon={ChartIcon} text="Gauge Vote History" caption="some text" />
          <SplashItem href="/chart" icon={BribersIcon} text="Briber Dashboard" caption="some text" />
          <SplashItem href="/chart" icon={StatsIcon} text="W Da F" caption="some text" />
        </Grid>
      </Center>
    </>
  );
}

export default ImG;


