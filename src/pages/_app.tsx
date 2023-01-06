import { type AppType } from "next/app";
import { useState } from "react";
import { trpc } from "../utils/trpc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiConfig } from "wagmi";
import { client, chains } from "utils/wagmiconf";
import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { ChakraProvider } from "@chakra-ui/react";
import { ColorModeScript } from "@chakra-ui/react";
import theme from "../styles/theme";
import { Header } from "components/Header";
import { TopRow } from "components/TopRow";
import { MyGlobalContext } from "contexts/GlobalContext";

//import "../styles/globals.css";

const queryClient = new QueryClient();

const MyApp: AppType = ({ Component, pageProps }) => {
  const [requestedRound, requestRound] = useState<string>("latest");
  const [gVersion, setGVersion] = useState<string>("");

  return (
    <>
      <MyGlobalContext.Provider
        value={{
          requestedRound,
          requestRound,
          gVersion,
          setGVersion,
        }}
      >
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
                <TopRow />
                <Header />
                <Component {...pageProps} />
              </ChakraProvider>
            </RainbowKitProvider>
          </WagmiConfig>
        </QueryClientProvider>
      </MyGlobalContext.Provider>
    </>
  );
};

export default trpc.withTRPC(MyApp);

