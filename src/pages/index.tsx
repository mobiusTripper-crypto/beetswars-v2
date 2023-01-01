import { type NextPage } from "next";
import { trpc } from "../utils/trpc";
import { Header } from "components/Header";
import { TopRow } from "components/TopRow";
import { TestPage } from "components/TestPage";

const Home: NextPage = () => {
  //  const hello = trpc.example.hello.useQuery({ text: "from tRPC" });
  return (
    <>
      <TopRow />
      <Header />
      <TestPage />
    </>
  );
};

export default Home;
