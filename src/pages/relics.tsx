import { Avatar, Box, Button, Card, Divider, HStack, Text, useToast, Wrap } from "@chakra-ui/react";
import useReliquary from "hooks/useReliquary";
import type { NextPage } from "next";
import { TransferTokenModel } from "components/TransferRelicModal";
import RelicLevel1 from "assets/images/reliquary/1.png";
import RelicLevel2 from "assets/images/reliquary/2.png";
import RelicLevel3 from "assets/images/reliquary/3.png";
import RelicLevel4 from "assets/images/reliquary/4.png";
import RelicLevel5 from "assets/images/reliquary/5.png";
import RelicLevel6 from "assets/images/reliquary/6.png";
import RelicLevel7 from "assets/images/reliquary/7.png";
import RelicLevel8 from "assets/images/reliquary/8.png";
import RelicLevel9 from "assets/images/reliquary/9.png";
import RelicLevel10 from "assets/images/reliquary/10.png";
import RelicLevel11 from "assets/images/reliquary/11.png";
import fBeetsImage from "assets/images/fBEETS.png";
import Image from "next/image";

const Relics: NextPage = () => {
  const { relicPositions, isLoadingRelicPositions, selectedRelic } = useReliquary();
  const toast = useToast();

  function getImage(level: number) {
    switch (level) {
      case 1:
        return RelicLevel1;
      case 2:
        return RelicLevel2;
      case 3:
        return RelicLevel3;
      case 4:
        return RelicLevel4;
      case 5:
        return RelicLevel5;
      case 6:
        return RelicLevel6;
      case 7:
        return RelicLevel7;
      case 8:
        return RelicLevel8;
      case 9:
        return RelicLevel9;
      case 10:
        return RelicLevel10;
      case 11:
        return RelicLevel11;
      default:
        return RelicLevel1;
    }
  }

  const relicLevelNames = [
    "The Initiate",
    "The Neophyte",
    "The Wanderer",
    "The Rebel",
    "The Skeptic",
    "The Apprentice",
    "The Journeyman",
    "The Savant",
    "The Creator",
    "The Scholar",
    "The Awakened",
  ];

  return relicPositions ? (
    <Wrap spacing={10}>
      {relicPositions.map((relic, index) => {
        console.log(relic, index);
        return (
          <Box key={index}>
            <Card m={12} p={6} w={300} variant="outline">
              <Text>Relic #{relic.relicId}</Text>
              <Divider m={3} />
              <Text>
                {relic.amount === "0.0"
                  ? "Empty relic - no level"
                  : `Level ${relic?.level + 1} - ${relicLevelNames[relic.level]}`}
              </Text>
              <Image
                style={{ cursor: "pointer" }}
                src={getImage(relic.amount === "0.0" ? 0 : relic?.level + 1)}
                width={200}
                height={200}
                alt="reliquary"
                placeholder="blur"
              />
              <HStack>
                <Avatar src={fBeetsImage.src} h={5} w={5} />
                <Text>{parseFloat(relic.amount).toLocaleString()}</Text>
              </HStack>
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
                <TransferTokenModel relic={relic} />
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
