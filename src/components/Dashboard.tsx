import { Box, SimpleGrid } from "@chakra-ui/react";
import type { CardData } from "types/card.component";
import { DashboardCard } from "./DashboardCard";

interface Props {
  cardList: CardData[];
  rows: number;
  columns: number;
}

// export const Dashboard: React.FC<Props> = ({ cardData, rows = 1, columns = 1 }) => {
export const Dashboard: React.FC<Props> = ({ cardList }) => {
  return (
    <SimpleGrid minChildWidth="120 px" spacing="40 px">
      {cardList.length > 0 && (
        <Box>
          {cardList.map((item, index) => (
            <DashboardCard cardData={item} key={index} />
          ))}
        </Box>
      )}
    </SimpleGrid>
  );
};
