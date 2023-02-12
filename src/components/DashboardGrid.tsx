import { Grid } from "@chakra-ui/react";
import type { CardData } from "types/card.component";
import { DashboardCard } from "./DashboardCard";

interface Props {
  cardList: CardData[];
  columns?: number;
}

export const DashboardGrid: React.FC<Props> = ({ cardList, columns = 3 }) => {
  const templatestring = `repeat(${columns}, 1fr)`;
  return (
    <Grid margin={6} templateColumns={templatestring} gap={6}>
      {cardList &&
        cardList.length > 0 &&
        cardList.map((item, index) => <DashboardCard cardData={item} key={index} />)}
    </Grid>
  );
};
