import { Link, Heading, Center, chakra } from "@chakra-ui/react";
import { Box, useColorModeValue, Text } from "@chakra-ui/react";
import NextLink from "next/link";

export const Header = () => {
  return (
    <Center>
      <Link as={NextLink} textDecoration={"none"} href="/" _hover={{ color: "#ed1200" }}>
        <Heading fontSize="6xl" fontWeight="800">
          <chakra.span color="#4BE39C">BEETS WARS</chakra.span> -{" "}
          <chakra.span color="#ED1200">ROI Dashboard</chakra.span>
        </Heading>
      </Link>
    </Center>
  );
};
