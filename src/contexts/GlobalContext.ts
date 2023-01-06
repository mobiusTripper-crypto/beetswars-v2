import { createContext, useContext } from "react";

type GlobalContext = {
  requestedRound: string;
  requestRound: (c: string) => void;
  gVersion: string;
  setGVersion: (c: string) => void;
};

export const MyGlobalContext = createContext<GlobalContext>({
  requestedRound: '',
  requestRound: () => {},
  gVersion: '',
  setGVersion: () => {},
});

export const useGlobalContext = () => useContext(MyGlobalContext);

