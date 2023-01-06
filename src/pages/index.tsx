import { type NextPage } from "next";
import { Header } from "components/Header";
import { TopRow } from "components/TopRow";
import { TestPage } from "components/TestPage";
import { ErrorBoundary } from "react-error-boundary";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useGlobalContext } from "contexts/GlobalContext";

const voteActive = true;

const Home: NextPage = () => {
  const { requestedRound } = useGlobalContext();
  const router = useRouter();

  useEffect(() => {
    if (!voteActive) {
      router.push("/chart");
    } else {
      router.push("/round/" + requestedRound);
    }
  }, []);

  return (
    <>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <TestPage />
      </ErrorBoundary>
    </>
  );
};

export default Home;

function ErrorFallback({ error }: { error: any }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: "red" }}>{error.message}</pre>
    </div>
  );
}
