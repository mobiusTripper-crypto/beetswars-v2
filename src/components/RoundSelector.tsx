import { trpc } from "utils/trpc";
import { useGlobalContext } from "contexts/GlobalContext";

// definition to avoid "any"
interface RoundSelectorProps {
  handleChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

// default fallback function to avoid empty function
const defaultHandleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  console.error("handleChange not provided on ", event.type);
};

export function RoundSelector({ handleChange = defaultHandleChange }: RoundSelectorProps): JSX.Element {
  const { requestedRound } = useGlobalContext();
  // const { requestedRound, requestRound } = useGlobalContext();

  const roundList = trpc.rounds.roundlist.useQuery(undefined, {
    refetchOnWindowFocus: false,
  }).data?.data ?? {
    rounds: [],
    latest: 0,
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
