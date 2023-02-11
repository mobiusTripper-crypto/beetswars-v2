import { Grid, GridItem } from "@chakra-ui/react";
import type { CardData } from "types/card.component";
import { DashboardCard } from "./DashboardCard";

interface Props {
  cardList: CardData[];
}

export const DashboardGrid: React.FC<Props> = ({ cardList }) => {
  return (
    <Grid templateRows="repeat(3, 1fr)" templateColumns="repeat(3, 1fr)" gap={4}>
      {cardList.length > 0 && (
        <GridItem>
          {cardList.map((item, index) => (
            <DashboardCard cardData={item} key={index} />
          ))}
        </GridItem>
      )}
    </Grid>
  );
};
