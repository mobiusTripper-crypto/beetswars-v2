import { Box, Card, Divider, Heading, Link, Text, useColorModeValue } from "@chakra-ui/react";
import type { CardData } from "types/card.component";

interface Props {
  cardData: CardData;
}

export const DashboardCard: React.FC<Props> = ({ cardData }) => {
  const bgCard = useColorModeValue("#D5E0EC", "#1C2635");

  return (
    <>
      <Card p={4} border="1px" width="360px" backgroundColor={bgCard}>
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
          <Divider h="2px" bg="#ED1200" my={3} />
          <Text>{cardData.text}</Text>
          {cardData.subtext && <Text fontSize="sm">{cardData.subtext}</Text>}
          {(cardData.text || cardData.subtext) && <Divider h="2px" bg="#ED1200" my={3} />}
          {cardData.data && cardData.data.length > 0 && (
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
