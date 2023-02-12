import type { AppProps } from "next/app";
import type { Session } from "next-auth";
// import type { AppType } from "next/app";
import { useState } from "react";
import { trpc } from "../utils/trpc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { WagmiConfig } from "wagmi";
import { client, chains } from "utils/wagmiconf";
import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { ChakraProvider } from "@chakra-ui/react";
import { ColorModeScript } from "@chakra-ui/react";
import theme from "../styles/theme";
import { Header } from "components/Header";
import { TopRow } from "components/TopRow";
import { SessionProvider } from "next-auth/react";
import { MyGlobalContext } from "contexts/GlobalContext";
//add additional font weights here in needed
import "@fontsource/inter/400.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/800.css";

const queryClient = new QueryClient();

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) => {
  const [requestedRound, requestRound] = useState<number|undefined>(undefined);
  const [display, setDisplay] = useState<string>("cards");
  const [voteActive, setVoteActive] = useState<boolean>(false);

  return (
    <SessionProvider session={session}>
      <MyGlobalContext.Provider
        value={{
          requestedRound,
          requestRound,
          display,
          setDisplay,
          voteActive,
          setVoteActive,
        }}
      >
        <QueryClientProvider client={queryClient}>
          <WagmiConfig client={client}>
            <RainbowKitProvider chains={chains} modalSize="compact" theme={darkTheme()}>
              <ChakraProvider theme={theme}>
                <ColorModeScript initialColorMode={theme.config.initialColorMode} />
                <TopRow />
                <Header />
                <Component {...pageProps} />
              </ChakraProvider>
            </RainbowKitProvider>
          </WagmiConfig>
          <ReactQueryDevtools />
        </QueryClientProvider>
      </MyGlobalContext.Provider>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
