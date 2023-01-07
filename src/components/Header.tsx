import { Heading, Center, chakra } from "@chakra-ui/react";

export const Header = () => {
  return (
    <Center>
      <Heading fontSize="5xl" fontWeight="800">
        <chakra.span color="#4BE39C">BEETS WARS</chakra.span> -{" "}
        <chakra.span color="#ED1200">ROI Dashboard</chakra.span>
      </Heading>
    </Center>
  );
};
