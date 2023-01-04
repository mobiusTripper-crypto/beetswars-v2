import { type NextPage } from "next";
import { trpc } from "../utils/trpc";
import { Header } from "components/Header";
import { TopRow } from "components/TopRow";
import { TestPage } from "components/TestPage";
import { ErrorBoundary } from "react-error-boundary";
import Router from "next/router";

const Home: NextPage = () => {
  //  const hello = trpc.example.hello.useQuery({ text: "from tRPC" });

  const voteActive = false;

  if (!voteActive) {
    Router.push("/chart");
  }

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
