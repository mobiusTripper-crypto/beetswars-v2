import { extendTheme, type ThemeConfig, type ChakraTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import type { StyleFunctionProps } from "@chakra-ui/styled-system";
import "@fontsource/inter";

export const siteTheme: Partial<ChakraTheme> = {
  styles: {
    global: (props: StyleFunctionProps) => ({
      body: {
        color: mode("#222", "#CCC")(props),
        background: mode("#F4F7FF", "#0d081c")(props),
      },
    }),
  },
  fonts: {
    heading: "Inter, sans-serif",
    body: "Inter, sans-serif",
  },
};

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

export const theme = extendTheme({ ...siteTheme, config });
export default theme;
