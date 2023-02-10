import { Box, HStack, Icon, Text } from "@chakra-ui/react";
import { ColorModeSwitcher } from "components/ColorModeSwitcher";
import { CustomConnectButton } from "components/CustomConnectButton";
import { useGlobalContext } from "contexts/GlobalContext";
import Link from "next/link";
import { useRouter } from "next/router";
import { CgCardSpades as CardIcon } from "react-icons/cg";
import { FaCoins as BribersIcon } from "react-icons/fa";
import { ImStatsBars as StatsIcon, ImTable as TableIcon } from "react-icons/im";
import { BiLineChart as ChartIcon } from "react-icons/bi";
import { RoundSelector } from "components/RoundSelector";
import React from "react";
import { useEffect } from "react";
import { useGetVp } from "hooks/useGetVp";
import { useRoundList } from "hooks/useRoundList";
import { useVoteState } from "hooks/useVoteState";

export const TopRow = () => {
  const { data: VoteStateActive } = useVoteState();
  //console.log("vote active:", VoteStateActive);
  const { requestedRound, requestRound, display } = useGlobalContext();
  const { data: votingPower, connected: accountConnected } = useGetVp();
  const { data: roundList, loaded: rloaded } = useRoundList();
  //  console.log("round list:", roundList, rloaded);
  const router = useRouter();
  const urlParam = router.query;
  const { asPath } = useRouter();
  console.log(asPath);

  useEffect(() => {
    if (urlParam.number) {
      const parsedNumber: number = urlParam.number ? parseInt(urlParam.number[0] as string) : NaN;
      console.log("urlparm num:", parsedNumber);
      if (parsedNumber && rloaded) {
        console.log("number:", parsedNumber);
        if (roundList.rounds.includes(parsedNumber)) {
          console.log("valid:", parsedNumber);
          requestRound(parsedNumber);
        } else {
          console.log("invalid -> latest:", parsedNumber);
          requestRound(roundList.latest);
        }
      } else {
        if (roundList && roundList.latest !== 0) {
          console.log("set to latest", roundList.latest);
          requestRound(roundList.latest);
          if (!VoteStateActive) {
            router.push("/round/" + roundList.latest, undefined, { shallow: true });
          }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundList, rloaded, urlParam]);

  const cardLink = "/round/" + requestedRound + "/cards";
  const tableLink = "/round/" + requestedRound + "/table";
  const wdafLink = "/wdaf";
  const bbDashLink = "/bribersDashboard";

  const iconProps = {
    size: "1.6rem",
    marginRight: "1rem",
  };

  // correct type instead of "any"
  const changeRound = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value);
    requestRound(parseInt(e.target.value));
    router.push("/round/" + e.target.value);
  };

  return (
    <>
      <HStack p={4} justifyContent="flex-end">
        {asPath === "/" ? (
          ""
        ) : (
          <>
            <Box style={{ marginRight: "1rem" }}>
              <Text fontSize="0.8rem" fontWeight="bold" color="#ED1200">
                {accountConnected ? `VP: ${votingPower?.toFixed(0)}` : ""}
              </Text>
            </Box>
            <Box style={{ marginRight: "1rem" }}>
              <RoundSelector handleChange={changeRound} />
            </Box>
            {display === "table" ? (
              <Link href={cardLink}>
                <Icon
                  as={CardIcon}
                  height={iconProps.size}
                  width={iconProps.size}
                  marginRight={iconProps.marginRight}
                  color={display === "table" ? "limegreen" : ""}
                />
              </Link>
            ) : (
              <Link href={tableLink}>
                <Icon
                  as={TableIcon}
                  height={iconProps.size}
                  width={iconProps.size}
                  marginRight={iconProps.marginRight}
                  color={display === "cards" ? "limegreen" : ""}
                />
              </Link>
            )}
            <Link href={bbDashLink}>
              <Icon
                as={BribersIcon}
                height="1.2rem"
                width={iconProps.size}
                marginRight={iconProps.marginRight}
              />
            </Link>
            <Link href="/chart">
              <Icon
                as={ChartIcon}
                height={iconProps.size}
                width={iconProps.size}
                marginRight={iconProps.marginRight}
              />
            </Link>
            <Link href={wdafLink}>
              <Icon
                as={StatsIcon}
                height={iconProps.size}
                width={iconProps.size}
                marginRight={iconProps.marginRight}
              />
            </Link>
          </>
        )}
        <CustomConnectButton />
        <ColorModeSwitcher />
      </HStack>
    </>
  );
};

export default TopRow;
