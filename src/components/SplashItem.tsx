import { Divider, Icon, Box, useColorModeValue, Center, Text } from "@chakra-ui/react";
import Link from "next/link";

interface SplashItemProps {
  text: string;
  caption: string;
  href: string;
  icon: any;
}

export function SplashItem(props: SplashItemProps) {
  const bgCard = useColorModeValue("#D5E0EC", "#1C2635");
  const iconProps = { size: "7rem" };

  return (
    <>
      <Box
        p={5}
        border="1px"
        borderRadius={20}
        backgroundColor={bgCard}
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
              _hover={{ color: "#ed1200" }}
              margin="1rem 0 1rem 0"
              as={props.icon}
              height={iconProps.size}
              width={iconProps.size}
            />
          </Center>
        </Link>
        <Center>
          <Text fontSize="1xl">{props.caption}</Text>
        </Center>
      </Box>
    </>
  );
}
