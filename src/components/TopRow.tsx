import Link from "next/link";
import { Box, HStack, Text, Icon } from "@chakra-ui/react";
import { CustomConnectButton } from "components/CustomConnectButton";
import { ColorModeSwitcher } from "components/ColorModeSwitcher";
import { ImStatsBars as StatsIcon, ImTable as TableIcon } from "react-icons/im";
import { CgCardSpades as CardIcon } from "react-icons/cg";

const iconSize = "2rem";
const iconMarginR = "1rem";

export const TopRow = () => {
  return (
    <>
      <HStack justify="flex-end" margin="1rem">
        <Box flex="1">
          <Text fontSize="1xl">Beets Wars V2</Text>
        </Box>
        <Box marginTop="5rem">
          <Link href="/chart">
            <Icon
              as={StatsIcon}
              height={iconSize}
              width={iconSize}
              marginRight={iconMarginR}
            />
          </Link>
          <Link href="/">
            <Icon
              as={CardIcon}
              height={iconSize}
              width={iconSize}
              marginRight={iconMarginR}
            />
          </Link>
          <Link href="/">
            <Icon
              as={TableIcon}
              height={iconSize}
              width={iconSize}
              marginRight={iconMarginR}
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
