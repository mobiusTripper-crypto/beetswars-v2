import { Box, Card, Heading, Link, Text } from "@chakra-ui/react";
import type { CardData } from "types/card.component";

interface Props {
  cardData: CardData;
}

export const DashboardCard: React.FC<Props> = ({ cardData }) => {
  return (
    <>
      <Card m={6} p={4}>
        <Box>
          {cardData.headUrl ? (
            <Link href={cardData.headUrl}>
              <Heading as="h3" size="lg">
                {cardData.heading}
              </Heading>
            </Link>
          ) : (
            <Heading as="h3" size="lg">
              {cardData.heading}
            </Heading>
          )}
          <hr />
          <Text>{cardData.text}</Text>
          {cardData.subtext && <Text fontSize="sm">{cardData.subtext}</Text>}
          <hr />
          {cardData.data.length > 0 && (
            <>
              {cardData.data.map(item => (
                <Box key="{item.key}">
                  <Text fontWeight="bold">{item.key}:</Text>
                  <Text>{item.value}</Text>
                </Box>
              ))}
            </>
          )}
          {cardData.footer && (
            <Text mt={2} fontSize="lg" fontWeight="bold" textAlign="right">
              {cardData.footer}
            </Text>
          )}
        </Box>
      </Card>
    </>
  );
};
