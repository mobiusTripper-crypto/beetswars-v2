import { Image, Button, Box, HStack, Icon, Text } from "@chakra-ui/react";
import { ColorModeSwitcher } from "components/ColorModeSwitcher";
import { CustomConnectButton } from "components/CustomConnectButton";
import { useGlobalContext } from "contexts/GlobalContext";
import Link from "next/link";
import { useRouter } from "next/router";
import { CgCardSpades as CardIcon } from "react-icons/cg";
import { FaCoins as BribersIcon } from "react-icons/fa";
//import { FaTools as ToolsIcon } from "react-icons/fa";
import { GoTools as ToolsIcon } from "react-icons/go";
import { ImTable as TableIcon } from "react-icons/im";  // ImStatsBars as StatsIcon, 
import { BiLineChart as ChartIcon } from "react-icons/bi";
import { RoundSelector } from "components/RoundSelector";
import React from "react";
import { useEffect } from "react";
import { useGetVp } from "hooks/useGetVp";
import { useRoundList } from "hooks/useRoundList";
import { useSession, signOut } from "next-auth/react";

let voteToken = "fBEETS";

export const TopRow = () => {
  const { data: session, status } = useSession();
  const { requestedRound, requestRound, display, setDisplay } = useGlobalContext();
  const { data: votingPower, connected: accountConnected } = useGetVp();
  const { data: roundList, loaded: roundListLoaded } = useRoundList();
  const router = useRouter();
  const urlParam = router.query;
  const { asPath } = useRouter();
  const numOnly = new RegExp(/^\d+$/);
  const parsedNumber: number =
    urlParam.number && numOnly.test(urlParam.number[0] as string)
      ? Number(parseInt(urlParam.number[0] as string))
      : NaN;

  //  console.log(session, status);

  console.log(
    "ap:",
    asPath,
    "rll:",
    roundListLoaded,
    "lr:",
    roundList?.latest,
    "pn:",
    parsedNumber,
    "rr:",
    requestedRound,
    "tkn:",
    voteToken
  );

  useEffect(() => {
    if ((requestedRound ?? 0) > 31) {
      voteToken = "maBEETS";
    } else {
      voteToken = "fBEETS";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestedRound]);

  useEffect(() => {
    if (
      asPath.includes("/round") &&
      roundListLoaded &&
      roundList.rounds.includes(requestedRound as number) &&
      (parsedNumber !== requestedRound || parsedNumber === 0 || isNaN(parsedNumber))
    ) {
      console.log("push:", parsedNumber, "->", requestedRound, display);
      router.push("/round/" + requestedRound + "/" + display, undefined, { shallow: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestedRound, parsedNumber]);

  useEffect(() => {
    if (urlParam.number && roundListLoaded) {
      if (parsedNumber !== requestedRound) {
        if (roundList.rounds.includes(parsedNumber)) {
          requestRound(parsedNumber);
        } else {
          requestRound(roundList.latest);
        }
      }
    } else if (
      requestedRound === undefined ||
      parsedNumber === undefined ||
      (asPath === "/" && requestedRound !== roundList.latest)
    ) {
      requestRound(roundList.latest);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundListLoaded, urlParam]);

  useEffect(() => {
    if (urlParam.number && urlParam.number[1]) {
      switch (urlParam.number[1]) {
        case "table":
          setDisplay("table");
          break;
        default:
          setDisplay("cards");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlParam]);

  const dashboardLink = "/round";
  const cardLink = dashboardLink + "/" + requestedRound + "/cards";
  const tableLink = dashboardLink + "/" + requestedRound + "/table";
  // const wdafLink = "/snapshotTimes"; // not on Sonic
  const bribersdashLink = "/bribersDashboard";
  const chartLink = "/gaugeVoteHistory";
  const relicsLink = "/relicTools";
  const linkActiveColor = "bw_green";
  const iconProps = {
    size: "1.6rem",
    smaller: "1.4rem",
    margin: "0 1rem 0 0",
  };

  // correct type instead of "any"
  const changeRound = (e: React.ChangeEvent<HTMLSelectElement>) => {
    //console.log(e.target.value);
    requestRound(parseInt(e.target.value));
  };

  return (
    <Box
      position="sticky"
      top="0"
      width="100%"
      p={2}
      mb={2}
      opacity="97%"
      bgColor="bg_toprow"
      zIndex="1"
    >
      <HStack justifyContent="flex-end" flexWrap="wrap">
        <HStack flex="1">
          {session && status === "authenticated" ? (
            <>
              <Link href="/admin">Signed in as {session?.user?.name}</Link>
              <Image
                src={session?.user?.image as string}
                alt="gh avatar"
                boxSize="25px"
                borderRadius="full"
                border="1px solid black"
              />
              <Button onClick={() => signOut({})}>Sign out</Button>
              {asPath.includes("/round/") ? <Link href="/bribeform">Edit Round</Link> : ""}
            </>
          ) : (
            ""
          )}
        </HStack>

        {asPath === "/" ? (
          ""
        ) : (
          <>
            <Box>
              <Text mr={2} fontWeight="bold" color="#ED1200">
                {accountConnected &&
                (asPath.includes(`${dashboardLink}`) || asPath.includes(`${tableLink}`))
                  ? `${voteToken} VP: ${votingPower?.toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}`
                  : ""}
              </Text>
            </Box>
            <Box>
              <RoundSelector handleChange={changeRound} />
            </Box>

            <Box>
              <Link href={cardLink}>
                <Icon
                  title="Main Dashboard Card View"
                  as={CardIcon}
                  _hover={{ color: "bw_red" }}
                  height={iconProps.size}
                  width={iconProps.size}
                  margin={iconProps.margin}
                  color={
                    asPath.includes(`${dashboardLink}`) && display === "cards"
                      ? `${linkActiveColor}`
                      : ""
                  }
                />
              </Link>
              <Link href={tableLink}>
                <Icon
                  title="Main Dashbhoard Table View"
                  as={TableIcon}
                  _hover={{ color: "bw_red" }}
                  height={iconProps.size}
                  width={iconProps.size}
                  margin={iconProps.margin}
                  color={
                    asPath.includes(`${dashboardLink}`) && display === "table"
                      ? `${linkActiveColor}`
                      : ""
                  }
                />
              </Link>
              <Link href={bribersdashLink}>
                <Icon
                  title="Briber's Dashboard"
                  as={BribersIcon}
                  _hover={{ color: "bw_red" }}
                  height="1.2rem"
                  width={iconProps.size}
                  margin={iconProps.margin}
                  color={asPath.includes(`${bribersdashLink}`) ? `${linkActiveColor}` : ""}
                />
              </Link>
              <Link href={chartLink}>
                <Icon
                  title="Gauge Vote History"
                  as={ChartIcon}
                  _hover={{ color: "bw_red" }}
                  height={iconProps.size}
                  width={iconProps.size}
                  margin={iconProps.margin}
                  color={asPath.includes(`${chartLink}`) ? `${linkActiveColor}` : ""}
                />
              </Link>
              {/* <Link href={wdafLink}>
                <Icon
                  title="Snapshot Times"
                  as={StatsIcon}
                  _hover={{ color: "bw_red" }}
                  height={iconProps.size}
                  width={iconProps.size}
                  margin={iconProps.margin}
                  color={asPath.includes(`${wdafLink}`) ? `${linkActiveColor}` : ""}
                />
              </Link> */}
              <Link href={relicsLink}>
                <Icon
                  title="Relic Tools"
                  as={ToolsIcon}
                  _hover={{ color: "bw_red" }}
                  height={iconProps.smaller}
                  width={iconProps.smaller}
                  margin={iconProps.margin}
                  color={asPath.includes(`${relicsLink}`) ? `${linkActiveColor}` : ""}
                />
              </Link>
            </Box>
          </>
        )}
        <CustomConnectButton />
        <ColorModeSwitcher />
      </HStack>
    </Box>
  );
};

export default TopRow;
