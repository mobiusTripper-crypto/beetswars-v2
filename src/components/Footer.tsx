import { Divider, Text } from "@chakra-ui/react";

export function Footer() {
  return (
    <>
      <Divider />
      <Text variant="body2" align="center" margin="22px">
        This website is still in BETA. This is 3rd party service independent of BeethovenX and
        please do your own research. This is not investment advice!
      </Text>
    </>
  );
}
