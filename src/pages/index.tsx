import { type NextPage } from "next";
import { trpc } from "../utils/trpc";
import { Header } from "components/Header";
import { TopRow } from "components/TopRow";

const Home: NextPage = () => {
  //  const hello = trpc.example.hello.useQuery({ text: "from tRPC" });
  return (
    <>
      <TopRow />
      <Header />
    </>
  );
};

export default Home;
