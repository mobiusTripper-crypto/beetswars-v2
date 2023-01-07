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
  const { number, display } = router.query;
  const Url = "/api/v1/bribedata/" + number;

  console.log(router.query);

  var disp: string;
  switch (display) {
    case "table":
      disp = "table";
      break;
    default:
      disp = "cards";
  }
  console.log(disp);

  const { data: bribedata, isLoading } = useQuery(["bribedata", Url], () =>
    fetchRoundData(Url)
  );

  if (isLoading) {
    return <Center>Loading ... </Center>;
  }

  return (
    <>
      <Center>
        <Box>
          <pre>
            Round {number} -- <Link href={Url}>{Url}</Link>
          </pre>
        </Box>
      </Center>
      <Center>
        <Box>
          <pre>{bribedata?.version}</pre>
        </Box>
      </Center>
      <Center>
        <Box>
          {bribedata?.bribedata.map((bribe: any, i: number) => (
            <pre key={i}>
              {i + 1} - {bribe.poolname}
            </pre>
          ))}
        </Box>
      </Center>
    </>
  );
}
