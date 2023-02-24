import { Link, Heading, Center, chakra } from "@chakra-ui/react";
import { useColorModeValue } from "@chakra-ui/react";
import NextLink from "next/link";

export const Header = () => {
  const beetsColor = useColorModeValue("#308E61", "#4BE39C");
  return (
    <Center>
      <Link as={NextLink} textDecoration={"none"} href="/" _hover={{ color: "#ed1200" }}>
        <Heading fontSize={["xl", "3xl", "5xl", "6xl", "7xl"]} fontWeight="800">
          <chakra.span color={beetsColor}>BEETS&nbsp;WARS</chakra.span>&nbsp;-&nbsp;
          <chakra.span color="#ED1200">ROI&nbsp;Dashboard</chakra.span>
        </Heading>
      </Link>
    </Center>
  );
};
