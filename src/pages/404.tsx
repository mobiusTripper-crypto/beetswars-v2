import { useEffect } from "react";
import { useRouter } from "next/router";
import { Progress, Center, Text } from "@chakra-ui/react";

const Page404 = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/");
  });

  return (
    <>
      <Progress size="xs" isIndeterminate />
      <Center>
        <Text fontSize="2xl">404 not found</Text>
      </Center>
    </>
  );
};

export default Page404;
