import { Box } from "@chakra-ui/react";
import { trpc } from "utils/trpc";
import { useGlobalContext } from "contexts/GlobalContext";

export function RoundSelector({ handleChange = () => {} }: any): JSX.Element {
  const { requestedRound, requestRound } = useGlobalContext();

  const roundList = trpc.rounds.roundlist.useQuery(undefined, {
    refetchOnWindowFocus: false,
  }).data?.data ?? {
    rounds: [],
    latest: 12,
  };

  return (
      <select onChange={handleChange} value={requestedRound}>
        {roundList.rounds.map((round: string, index: number) => (
          <option key={index} value={round}>
            Round {round}
          </option>
        ))}
      </select>
  );
}

export default RoundSelector;
