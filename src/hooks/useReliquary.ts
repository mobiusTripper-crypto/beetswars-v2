import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { type ReliquaryFarmPosition, reliquaryService } from "services/reliquary";
import { useAccount, useProvider } from "wagmi";

export default function useReliquary() {
  const account = useAccount();
  const provider = useProvider();
  const [selectedRelicId, setSelectedRelicId] = useState<string | undefined>(undefined);

  const {
    data: relicPositionsUnsorted = [],
    isLoading: isLoadingRelicPositions,
    refetch: refetchRelicPositions,
  } = useQuery(
    ["reliquaryAllPositions", account.address],
    async () => {
      const positions: ReliquaryFarmPosition[] = await reliquaryService.getAllPositions({
        userAddress: account.address || "",
        provider,
      });

      if (positions.length > 0 && selectedRelicId === undefined) {
        setSelectedRelicId(positions[0]?.relicId);
      }

      return positions;
    },
    {
      enabled: !!account.address,
    }
  );

  const relicPositions = relicPositionsUnsorted.sort(
    (a, b) => parseInt(a.relicId) - parseInt(b.relicId)
  );

  const selectedRelic = (relicPositions || []).find(
    position => position.relicId === selectedRelicId
  );

  return {
    relicPositions,
    isLoadingRelicPositions,
    reliquaryService,
    selectedRelicId: selectedRelicId,
    selectedRelic: selectedRelic || null,
    refetchRelicPositions,
  };
}
