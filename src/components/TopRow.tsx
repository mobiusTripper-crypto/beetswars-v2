import { Box, HStack, Text, Icon } from "@chakra-ui/react";
import { CustomConnectButton } from "components/CustomConnectButton";
import { ColorModeSwitcher } from "components/ColorModeSwitcher";
import { ImStatsBars, ImTable } from "react-icons/im";
import { CgCardSpades } from "react-icons/cg";

const iconSize = "2rem";

export const TopRow = () => {
  return (
    <>
      <HStack justify="flex-end">
        <Box flex="1">
          <Text fontSize="1xl">Beets Wars V2</Text>
        </Box>
        <Box>
          <Icon
            as={ImStatsBars}
            height={iconSize}
            width={iconSize}
            marginRight="1rem"
            marginTop="0.5rem"
          />
          <Icon
            as={CgCardSpades}
            height={iconSize}
            width={iconSize}
            marginRight="1rem"
          />
          <Icon
            as={ImTable}
            height={iconSize}
            width={iconSize}
            marginRight="1rem"
          />
        </Box>
        <CustomConnectButton />
        <ColorModeSwitcher />
      </HStack>
    </>
  );
};

export default TopRow;
