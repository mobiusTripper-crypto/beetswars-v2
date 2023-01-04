import { Box, HStack, Icon, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { ColorModeSwitcher } from "components/ColorModeSwitcher";
import { CustomConnectButton } from "components/CustomConnectButton";
import { useGlobalContext } from "contexts/GlobalContext";
import Link from "next/link";
import { useRouter } from "next/router";
import { CgCardSpades as CardIcon } from "react-icons/cg";
import { ImStatsBars as StatsIcon, ImTable as TableIcon } from "react-icons/im";
import { fetchRoundIndex } from "utils/fetchRoundIndex";

export const TopRow = () => {
  const { requestedRound, requestRound } = useGlobalContext();
  const cardLink = "/round/" + requestedRound + "?cards";
  const tableLink = "/round/" + requestedRound + "?table";
  const router = useRouter();

  const iconProps = {
    size: "1.6rem",
    marginRight: "1rem",
  };

  const { data: roundList, status } = useQuery({
    queryKey: ["roundlist"],
    queryFn: fetchRoundIndex,
    refetchInterval: false,
    refetchOnWindowFocus: false,
  });

  const handleChange = (e: any) => {
    console.log(e.target.value);
    requestRound(e.target.value);
    const href = "/round/" + e.target.value;
    router.push(href);
  };

import { trpc } from "../utils/trpc";


const iconSize = "2rem";
const iconMarginR = "1rem";

export const TopRow = () => {
  const roundlistT = trpc.rounds.roundlist.useQuery().data?.data ?? {rounds:[],latest:0}
  return (
    <>
      <HStack justify="flex-end" margin="1rem">
        <Box flex="1">
          <Link href="/">
            <Text fontSize="1xl">Beets Wars V2 -- {requestedRound} </Text>
          </Link>
        </Box>
        <Box style={{ marginRight: "9px" }}>
          <select onChange={handleChange} value={requestedRound}>
            {roundList?.map((bf: any, index: number) => (
              <option key={index} value={bf}>
                Round {bf}
              </option>
            ))}
          </select>
        </Box>
        <Box>
          <p>latest: {roundlist.latest}</p>
          <p>{roundlist.rounds.toString()}</p>
        </Box>
        <Box marginTop="5rem">
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
            />
          </Link>
          <Link href={tableLink}>
            <Icon
              as={TableIcon}
              height={iconProps.size}
              width={iconProps.size}
              marginRight={iconProps.marginRight}
            />
          </Link>
        </Box>
        <CustomConnectButton />
        <ColorModeSwitcher />
      </HStack>
    </>
  );
};

export default TopRow;
