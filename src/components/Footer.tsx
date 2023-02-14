import NextLink from "next/link";
import { Divider, Text, Link, Icon } from "@chakra-ui/react";
import { ImArrowUpRight2 as ArrowIcon } from "react-icons/im";

const githubLink = "https://github.com/mobiusTripper-crypto/beetswars-v2/";
const beetsLink = "https://beets.fi/";

export function Footer() {
  return (
    <>
      <Divider marginTop="2rem" />
      <Text variant="body2" align="center" margin="1rem">
        This website is still in BETA. This is{" "}
        <Link as={NextLink} href={githubLink} isExternal>
          3rd party <Icon as={ArrowIcon} boxSize="0.8em" />
        </Link>{" "}
        service independent of{" "}
        <Link as={NextLink} href={beetsLink} isExternal>
          BeethovenX <Icon as={ArrowIcon} boxSize="0.8em" />
        </Link>{" "}
        and please do your own research. This is not investment advice!
      </Text>
    </>
  );
}

