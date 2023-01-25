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
  requestRound: () => {}, // eslint-disable-line no-empty-function
  display: "",
  setDisplay: () => {}, // eslint-disable-line no-empty-function
  gVersion: "",
  setGVersion: () => {}, // eslint-disable-line no-empty-function
});

export const useGlobalContext = () => useContext(MyGlobalContext);
