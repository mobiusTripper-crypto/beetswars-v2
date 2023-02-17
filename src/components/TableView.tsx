import { Center, Link, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import type { BribeOffer } from "types/bribelist.trpc";

interface Props {
  data: BribeOffer[];
}

export const OfferTable: React.FC<Props> = ({ data }) => {
  const [sortedData, setSortedData] = useState(data);
  const [sortField, setSortField] = useState<string>("");
  const [sortAscending, setSortAscending] = useState(true);

  useEffect(() => {
    setSortedData(data);
  }, [data]);

  const sortData = (field: string) => {
    const sortdir = sortField === field ? !sortAscending : true;
    const i = sortdir ? 1 : -1;
    const sorted = [...data].sort((a, b) => {
      // eslint-disable-next-line
      return (a as any)[field] > (b as any)[field] ? i : -i;
    });
    setSortField(field);
    setSortedData(sorted);
    setSortAscending(sortdir);
  };

  return (
    <Center>
      <TableContainer mt={6}>
        <Table variant="striped">
          <Thead>
            <Tr>
              <Th onClick={() => sortData("poolname")} cursor="pointer">
                Name {sortField === "poolname" ? "♦" : ""}
              </Th>
              <Th isNumeric onClick={() => sortData("rewardAmount")} cursor="pointer">
                Total Offer ${sortField === "rewardAmount" ? "♦" : ""}
              </Th>
              <Th isNumeric onClick={() => sortData("votes")} cursor="pointer">
                Votes {sortField === "votes" ? "♦" : ""}
              </Th>
              <Th isNumeric onClick={() => sortData("percent")} cursor="pointer">
                Votes % {sortField === "percent" ? "♦" : ""}
              </Th>
              <Th isNumeric onClick={() => sortData("usdPer1000Vp")} cursor="pointer">
                $/1kVP {sortField === "usdPer1000Vp" ? "♦" : ""}
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {sortedData.map(
              (row, i): JSX.Element => (
                <Tr key={i}>
                  <Td>
                    <Link href={row.poolurl} isExternal>
                      {row.poolname}
                    </Link>
                  </Td>
                  <Td isNumeric>{row.rewardAmount.toLocaleString()}</Td>
                  <Td isNumeric>{row.votes.toLocaleString()}</Td>
                  <Td isNumeric>{row.percent.toFixed(2)}</Td>
                  <Td isNumeric>{row.usdPer1000Vp.toFixed(2)}</Td>
                </Tr>
              )
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </Center>
  );
};
