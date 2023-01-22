import { Box, HStack, Icon, Text } from "@chakra-ui/react";
import { ColorModeSwitcher } from "components/ColorModeSwitcher";
import { CustomConnectButton } from "components/CustomConnectButton";
import { useGlobalContext } from "contexts/GlobalContext";
import Link from "next/link";
import router, { useRouter } from "next/router";
import { useEffect } from "react";
import { CgCardSpades as CardIcon } from "react-icons/cg";
import { ImStatsBars as StatsIcon, ImTable as TableIcon } from "react-icons/im";
import { trpc } from "../utils/trpc";

export const TopRow = () => {
  const { requestedRound, requestRound, display, setDisplay } =
    useGlobalContext();
  const cardLink = "/round/" + requestedRound + "/cards";
  const tableLink = "/round/" + requestedRound + "/table";
  const router = useRouter();

  const roundList = trpc.rounds.roundlist.useQuery(undefined, {
    refetchOnWindowFocus: false,
  }).data?.data ?? {
    rounds: [],
    latest: 0,
  };

  const iconProps = {
    size: "1.6rem",
    marginRight: "1rem",
  };

  const handleChange = (e: any) => {
    console.log(e.target.value);
    requestRound(e.target.value);
    const href = "/round/" + e.target.value;
    router.push(href);
  };

  return (
    <>
      <HStack p={4} justifyContent="flex-end">
        <Box>
          <Link href="/bribeform">
            <Text fontSize="1xl">bribeform</Text>
          </Link>
        </Box>
        <Box style={{ marginRight: "9px" }}>
          <select onChange={handleChange} value={requestedRound}>
            {roundList.rounds.map((bf: any, index: number) => (
              <option key={index} value={bf}>
                Round {bf}
              </option>
            ))}
          </select>
        </Box>
        <Link href="/chart">
          <Icon
            as={StatsIcon}
            height={iconProps.size}
            width={iconProps.size}
            marginRight={iconProps.marginRight}
          />
        </Link>
        <Link href={cardLink}>
          <Icon
            as={CardIcon}
            height={iconProps.size}
            width={iconProps.size}
            marginRight={iconProps.marginRight}
            color={display === "cards" ? "limegreen" : ""}
          />
        </Link>
        <Link href={tableLink}>
          <Icon
            as={TableIcon}
            height={iconProps.size}
            width={iconProps.size}
            marginRight={iconProps.marginRight}
            color={display === "table" ? "limegreen" : ""}
          />
        </Link>
        <CustomConnectButton />
        <ColorModeSwitcher />
      </HStack>
    </>
  );
};

export default TopRow;

//      <p>{roundList.rounds.toString()}</p>
