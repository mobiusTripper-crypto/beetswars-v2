import { Box, useColorModeValue, Progress, Center, Text } from "@chakra-ui/react";
import Image from "next/image";
import pic1 from "../../../public/pic1.png";

const ImG = () => {
  const bgCard = useColorModeValue("#D5E0EC", "#1C2635");

  return (
    <>
      <Center>
        <Box
          margin="23px"
          p={9}
          border="1px"
          borderRadius={20}
          backgroundColor={bgCard}
          maxWidth="fit-content"
        >
          <Center>
            <Text fontSize="2xl">Example image served from ../public</Text>
          </Center>
          <Center>
            <Image
              src={pic1}
              alt="Picture pic1"
              width={300}
              placeholder="blur" // Optional blur-up while loading
            />
          </Center>
        </Box>
      </Center>
    </>
  );
};

export default ImG;
