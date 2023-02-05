/* eslint-disable @typescript-eslint/no-empty-function */

// TODO: find typesafe way to declare default(empty) functions

import { createContext, useContext } from "react";

type GlobalContext = {
  requestedRound: number;
  requestRound: (c: number) => void;
  display: string;
  setDisplay: (c: string) => void;
  gVersion: string;
  setGVersion: (c: string) => void;
};

export const MyGlobalContext = createContext<GlobalContext>({
  requestedRound: 0,
  requestRound: () => {},
  display: "",
  setDisplay: () => {},
  gVersion: "",
  setGVersion: () => {},
});

export const useGlobalContext = () => useContext(MyGlobalContext);
