import { Icon, Box, Center, Text } from "@chakra-ui/react";
import Link from "next/link";

interface SplashItemProps {
  text: string;
  caption: string;
  href: string;
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>,
  indicator?: boolean;
}

export function SplashItem(props: SplashItemProps) {
  const iconProps = { size: "7rem" };

  return (
    <>
      <Box
        p={5}
        border="1px"
        borderRadius={20}
        backgroundColor="bg_card"
        maxWidth="fit-content"
        minWidth="300px"
        margin="23px"
      >
        <Center>
          <Text fontSize="2xl">{props.text}</Text>
        </Center>

        <Link href={props.href} passHref replace>
          <Center>
            <Icon
              _hover={{ color: "bw_red" }}
              margin="1rem 0 1rem 0"
              as={props.icon}
              height={iconProps.size}
              width={iconProps.size}
            />
          </Center>
        </Link>
        <Center>
          <Text fontSize="1xl">
            {props.caption}
            {props?.indicator ? " active" : ""}
          </Text>
        </Center>
      </Box>
    </>
  );
}
