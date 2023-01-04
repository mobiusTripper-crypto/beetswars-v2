import { Box, Center } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/router";

async function fetchRoundData(url: string) {
  console.log(url);
  const res = await fetch(url || "");
  return res.json();
}

export default function Round() {
  const router = useRouter();
  const { number } = router.query;
  const Url = "/api/v1/bribedata/" + number;

  const { data: bribedata, isLoading } = useQuery(["bribedata", Url], () =>
    fetchRoundData(Url)
  );

  console.log(bribedata);

  if (isLoading) {
    return <Center>Loading ... </Center>;
  }

  return (
    <>
      <Center>
        Round {number} -- <Link href={Url}> {Url} </Link>
      </Center>
      <Center>
        <pre>{bribedata?.version}</pre>
      </Center>
      <Center>
        <Box>
          {bribedata?.bribedata.map((bribe: any, i: number) => (
            <pre>
              {i + 1} - {bribe.poolname}
            </pre>
          ))}
        </Box>
      </Center>
    </>
  );
}
