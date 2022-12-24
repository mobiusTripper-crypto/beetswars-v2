import { type NextPage } from "next";
import { trpc } from "../utils/trpc";
import { HStack, Text } from "@chakra-ui/react";
import { WagmiConfig } from "wagmi";
import { client, chains } from "utils/wagmiconf";
import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { CustomConnectButton } from "components/CustomConnectButton";

const Home: NextPage = () => {
  const hello = trpc.example.hello.useQuery({ text: "from tRPC" });

  return (
    <WagmiConfig client={client}>
      <RainbowKitProvider
        chains={chains}
        modalSize="compact"
        theme={darkTheme()}
      >
        <HStack justify="space-between">
          <Text>Beets Wars V2</Text>
          <CustomConnectButton />
        </HStack>
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default Home;
