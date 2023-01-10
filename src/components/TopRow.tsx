import Link from "next/link";
import { Box, HStack, Text, Icon } from "@chakra-ui/react";
import { CustomConnectButton } from "components/CustomConnectButton";
import { ColorModeSwitcher } from "components/ColorModeSwitcher";
import { ImStatsBars as StatsIcon, ImTable as TableIcon } from "react-icons/im";
import { CgCardSpades as CardIcon } from "react-icons/cg";
import { trpc } from "../utils/trpc";

const iconSize = 8;

export const TopRow = () => {
  const roundlist = trpc.rounds.roundlist.useQuery().data?.data ?? {
    rounds: [],
    latest: 0,
  };
  return (
    <>
      <HStack justify="flex-end" p={4}>
        <Box flex="1">
          <Text fontSize="1xl">Beets Wars V2</Text>
        </Box>
        <Box>
          <p>latest: {roundlist.latest}</p>
          <p>{roundlist.rounds.toString()}</p>
        </Box>
        <HStack mt={20} spacing={4}>
          <Link href="/chart">
            <Icon as={StatsIcon} h={iconSize} w={iconSize} />
          </Link>
          <Link href="/">
            <Icon as={CardIcon} h={iconSize} w={iconSize} />
          </Link>
          <Link href="/">
            <Icon as={TableIcon} h={iconSize} w={iconSize} />
          </Link>
          <CustomConnectButton />
          <ColorModeSwitcher />
        </HStack>
      </HStack>
    </>
  );
};

export default TopRow;
