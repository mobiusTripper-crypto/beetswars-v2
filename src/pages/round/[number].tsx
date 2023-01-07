import {
  SimpleGrid,
  Heading,
  Button,
  Text,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Box,
  Center,
} from "@chakra-ui/react";
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

  console.log(bribedata);

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
        {disp === "cards" ? (
          <SimpleGrid
            spacing="20px"
            minChildWidth='190px' 
            columns={[3, null, 4]}
          >
            {bribedata?.bribedata.map((bribe: any, i: number) => (
              <Box key={i}>
                <Card>
                  <CardHeader>
                    <Heading size="md">{bribe.poolname}</Heading>
                  </CardHeader>
                  <CardBody>
                    <Text>
                      {bribe.rewarddescription}
                      <Text></Text>
                      {bribe.assumption}
                    </Text>
                  </CardBody>
                  <CardFooter>
                    <Button>
                      <Link href={bribe.poolurl}>Pool Link</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </Box>
            ))}
          </SimpleGrid>
        ) : (
          <table>
            {bribedata?.bribedata.map((bribe: any, i: number) => (
              <tr key={i}>
                <td > {bribe.voteindex}</td>
                <td > {bribe.poolname}</td>
                <td > {bribe.rewarddescription}</td>
                <td > {bribe.url}</td>
              </tr>
            ))}
          </table>
        )}
      </Center>
    </>
  );
}
