import { SimpleGrid } from "@chakra-ui/react";
import type { CardData } from "types/card.component";
import { DashboardCard } from "./DashboardCard";

interface Props {
  cardList: CardData[];
  columns?: number;
}

export const DashboardGrid: React.FC<Props> = ({ cardList }) => {
  return (
    <SimpleGrid spacing={6} columns={[1, null, 2, null, 3]} w="max-content">
      {cardList &&
        cardList.length > 0 &&
        cardList.map((item, index) => <DashboardCard cardData={item} key={index} />)}
    </SimpleGrid>
  );
};
