import type { NextPage } from "next";
import { ErrorBoundary } from "react-error-boundary";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useGlobalContext } from "contexts/GlobalContext";
import { useVoteState } from "hooks/useVoteState";
import { Progress, Center, Text } from "@chakra-ui/react";

const Home: NextPage = () => {
  const { requestedRound } = useGlobalContext();
  const router = useRouter();

  const { data: voteStateActive, loaded: stateLoaded } = useVoteState();

  useEffect(() => {
    if (stateLoaded) {
      if (voteStateActive) {
        console.log("vote active:", voteStateActive);
        router.push("/round/" + requestedRound);
      } else {
        console.log("vote inactive:", voteStateActive);
        router.push("/chart");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voteStateActive, stateLoaded]);

  if (!stateLoaded) {
    return (
      <>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Progress size="xs" isIndeterminate />
          <Center>
            <Text fontSize="2xl">Init .... </Text>
          </Center>
        </ErrorBoundary>
      </>
    );
  }

  return <></>;
};

export default Home;

// function ErrorFallback({ error }: { error: any }) {
function ErrorFallback({ error }: { error: Error }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: "red" }}>{error.message}</pre>
    </div>
  );
}
