import {
  Icon,
  Link, Box,
  useColorModeValue, Center, Text
} from "@chakra-ui/react";

export function SplashItem(props: any) {
  const bgCard = useColorModeValue("#D5E0EC", "#1C2635");
  const iconProps = {
    size: "7rem",
    marginRight: "1rem",
  };
  return (
    <>
          <Link href={props.href}>
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
        <Center>
            <Icon margin="1rem 0 0 0" as={props.icon} height={iconProps.size} width={iconProps.size} />
        </Center>
        <Center>
          <Text fontSize="1xl">{props.caption}</Text>
        </Center>
      </Box>
          </Link>
    </>
  );
}
