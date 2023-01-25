/* eslint-disable no-empty-function */
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
});

export const useGlobalContext = () => useContext(MyGlobalContext);
