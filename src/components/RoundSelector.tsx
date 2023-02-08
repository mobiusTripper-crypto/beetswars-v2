import { trpc } from "utils/trpc";
import { useGlobalContext } from "contexts/GlobalContext";
import { Select } from "@chakra-ui/react";
import { useRoundList } from "hooks/useRoundList";

// definition to avoid "any"
interface RoundSelectorProps {
  handleChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

// default fallback function to avoid empty function
const defaultHandleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  console.error("handleChange not provided on ", event.type);
};

export function RoundSelector({
  handleChange = defaultHandleChange,
}: RoundSelectorProps): JSX.Element {
  const { requestedRound } = useGlobalContext();

  const { data: roundList, loaded } = useRoundList();

  /*
  const roundList = trpc.rounds.list.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchInterval: 0,
    staleTime: Infinity,
  }).data?.data ?? {
    rounds: [] as number[],
    latest: 0,
  };
*/

if (!loaded) { return (<>XXXX</>) }

  return (
    <Select onChange={handleChange} value={requestedRound}>
      {roundList.rounds.map((round: number, index: number) => (
        <option key={index} value={round}>
          Round {round}
        </option>
      ))}
    </Select>
  );
}

export default RoundSelector;
