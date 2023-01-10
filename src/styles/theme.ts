import {
  extendTheme,
  type ThemeConfig,
  type ChakraTheme,
} from "@chakra-ui/react";
import "@fontsource/raleway";

export const siteTheme: Partial<ChakraTheme> = {
  styles: {},
  fonts: {
    heading: "Raleway, sans-serif",
    body: "Raleway, sans-serif",
  },
};

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

export const theme = extendTheme({ ...siteTheme, config });
export default theme;
