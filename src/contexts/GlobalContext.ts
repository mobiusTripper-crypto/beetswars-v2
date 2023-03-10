/* eslint-disable @typescript-eslint/no-empty-function */

// TODO: find typesafe way to declare default(empty) functions

import { createContext, useContext } from "react";

type GlobalContext = {
  requestedRound: number|undefined;
  requestRound: (c: number|undefined) => void;
  display: string;
  setDisplay: (c: string) => void;
  voteActive: boolean;
  setVoteActive: (c: boolean) => void;
};

export const MyGlobalContext = createContext<GlobalContext>({
  requestedRound: undefined,
  requestRound: () => {},
  display: "",
  setDisplay: () => {},
  voteActive: false,
  setVoteActive: () => {},
});

export const useGlobalContext = () => useContext(MyGlobalContext);
