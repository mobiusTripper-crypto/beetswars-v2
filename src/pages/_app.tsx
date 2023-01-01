import { type AppType } from "next/app";
import { trpc } from "../utils/trpc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiConfig } from "wagmi";
import { client, chains } from "utils/wagmiconf";
import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { ChakraProvider } from "@chakra-ui/react";
import { ColorModeScript } from "@chakra-ui/react";
import theme from "../styles/theme";
//import "../styles/globals.css";

const queryClient = new QueryClient();

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <WagmiConfig client={client}>
          <RainbowKitProvider
            chains={chains}
            modalSize="compact"
            theme={darkTheme()}
          >
            <ChakraProvider theme={theme}>
              <ColorModeScript
                initialColorMode={theme.config.initialColorMode}
              />
              <Component {...pageProps} />
            </ChakraProvider>
          </RainbowKitProvider>
        </WagmiConfig>
      </QueryClientProvider>
    </>
  );
};

export default trpc.withTRPC(MyApp);
