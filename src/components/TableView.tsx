import { Center, Link, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { useState } from "react";
import type { BribeOffer } from "types/bribelist.trpc";

interface Props {
  data: BribeOffer[];
}

export const OfferTable: React.FC<Props> = ({ data }) => {
  const [sortedData, setSortedData] = useState(data);
  const [sortField, setSortField] = useState<string>("");
  const [sortAscending, setSortAscending] = useState(true);

  const sortData = (field: string) => {
    setSortAscending(sortField === field ? !sortAscending : true);
    const i = sortAscending ? 1 : -1;
    const sorted = [...data].sort((a, b) => {
      // eslint-disable-next-line
      return (a as any)[field] > (b as any)[field] ? i : -i;
    });
    setSortField(field);
    setSortedData(sorted);
  };

  return (
    <Center>
      <TableContainer mt={6}>
        <Table variant="striped">
          <Thead>
            <Tr>
              <Th onClick={() => sortData("poolname")}>
                Name {sortField === "poolname" ? "♦" : ""}
              </Th>
              <Th onClick={() => sortData("rewardAmount")}>
                Total Offer {sortField === "rewardAmount" ? "♦" : ""}
              </Th>
              <Th onClick={() => sortData("votes")}>Votes {sortField === "votes" ? "♦" : ""}</Th>
              <Th onClick={() => sortData("percent")}>
                Votes % {sortField === "percent" ? "♦" : ""}
              </Th>
              <Th onClick={() => sortData("usdPer1000Vp")}>
                $ per 1000 VP {sortField === "usdPer1000Vp" ? "♦" : ""}
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
                  <Td>$ {row.rewardAmount.toLocaleString()}</Td>
                  <Td>{row.votes.toLocaleString()}</Td>
                  <Td>{row.percent.toFixed(2)}</Td>
                  <Td>$ {row.usdPer1000Vp.toFixed(2)}</Td>
                </Tr>
              )
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </Center>
  );
};
