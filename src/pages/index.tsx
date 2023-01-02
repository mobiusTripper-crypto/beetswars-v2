import { type NextPage } from "next";
import { trpc } from "../utils/trpc";
import { Header } from "components/Header";
import { TopRow } from "components/TopRow";
import { TestPage } from "components/TestPage";
import { ErrorBoundary } from "react-error-boundary";

const Home: NextPage = () => {
  //  const hello = trpc.example.hello.useQuery({ text: "from tRPC" });
  return (
    <>
      <TopRow />
      <Header />
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <TestPage />
      </ErrorBoundary>
    </>
  );
};

export default Home;

function ErrorFallback({ error }: {error:any}) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: "red" }}>{error.message}</pre>
    </div>
  );
}
