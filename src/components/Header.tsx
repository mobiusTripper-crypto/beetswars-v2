import { Box, Heading, Center } from "@chakra-ui/react";

export const Header = () => {
  return (
    <Center>
      <Heading fontSize="6xl" fontWeight="800">
        <Box sx={{ display: "inline", color: "#4BE39C" }}>BEETS WARS</Box>
        {" - "}
        <Box sx={{ display: "inline", color: "#ED1200" }}>ROI Dashboard</Box>
      </Heading>
    </Center>
  );
};
