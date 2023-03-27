import { Box, Button, Card, Divider, HStack, Text, useToast, Wrap } from "@chakra-ui/react";
import useReliquary from "hooks/useReliquary";
import type { NextPage } from "next";
import { FbBack, FbSmall } from "components/fbeet";

const Relics: NextPage = () => {
  const { relicPositions, isLoadingRelicPositions, selectedRelic, transfer } = useReliquary();
  const toast = useToast();

  return relicPositions ? (
    <Wrap spacing={10}>
      {relicPositions.map((relic, index) => {
        console.log(relic, index);
        return (
          <Box key={index}>
            <Card m={12} p={6} w={300} variant="outline">
              <Text>Relic #{relic.relicId}</Text>
              <Divider m={3} />
              <Text>Level: {relic.level}</Text>
              <Text>
                {/* <FbSmall /> */}
                {relic.amount}
              </Text>
              <Text>Entry: {new Date((relic.entry || 0) * 1000).toDateString()}</Text>
              <Divider m={3} />
              <HStack>
                <Button
                  onClick={() =>
                    toast({
                      title: "Split",
                      description: `split relic #${relic.relicId}`,
                      status: "success",
                      duration: 5000,
                      isClosable: true,
                      position: "top",
                    })
                  }
                >
                  Split
                </Button>
                <Button
                  onClick={() =>
                    toast({
                      title: "Merge",
                      description: `merge relic #${relic.relicId}`,
                      status: "success",
                      duration: 5000,
                      isClosable: true,
                      position: "top",
                    })
                  }
                >
                  Merge
                </Button>
                <Button
                  onClick={() => {
                    transfer(relic.relicId);
                    toast({
                      title: "Transfer",
                      description: `transfer relic #${relic.relicId}`,
                      status: "success",
                      duration: 5000,
                      isClosable: true,
                      position: "top",
                    });
                  }}
                >
                  Transfer
                </Button>
              </HStack>
            </Card>
          </Box>
        );
      })}
    </Wrap>
  ) : (
    <Text>Connect Wallet</Text>
  );
};

export default Relics;
