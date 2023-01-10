import type { AppProps } from "next/app";
import type { Session } from "next-auth";
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
import { SessionProvider } from "next-auth/react";
//add additional font weights here in needed
import "@fontsource/raleway/400.css";
import "@fontsource/raleway/800.css";

const queryClient = new QueryClient();

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) => {
  return (
    <SessionProvider session={session}>
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
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
