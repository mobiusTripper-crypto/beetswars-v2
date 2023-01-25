import { createContext, useContext } from "react";

type GlobalContext = {
  requestedRound: string;
  requestRound: (c: string) => void;
  display: string;
  setDisplay: (c: string) => void;
  gVersion: string;
  setGVersion: (c: string) => void;
};

export const MyGlobalContext = createContext<GlobalContext>({
  requestedRound: "",
  requestRound: () => {},
  display: "",
  setDisplay: () => {},
  gVersion: "",
  setGVersion: () => {},
}); // eslint-disable-line no-empty-function

export const useGlobalContext = () => useContext(MyGlobalContext);
