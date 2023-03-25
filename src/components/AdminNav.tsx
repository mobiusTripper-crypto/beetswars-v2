import { Card, Button, HStack } from "@chakra-ui/react";
import { useRouter } from "next/router";

export const AdminNav = () => {
  const router = useRouter();
  const currentPath = router.pathname;
  const adminPath = "/admin";
  const bribeformPath = "/bribeform";
  const poolPath = "/editVotablePools";
  const logPath = "/cronLogs";

  return (
    <>
      <Card m={6} p={2}>
        <HStack gap={6}>
          <Button
            onClick={() => router.push(adminPath)}
            isActive={currentPath === adminPath ? true : false}
          >
            Admin
          </Button>
          <Button
            onClick={() => router.push(bribeformPath)}
            isActive={currentPath === bribeformPath ? true : false}
          >
            Bribe Forms
          </Button>
          <Button
            onClick={() => router.push(poolPath)}
            isActive={currentPath === poolPath ? true : false}
          >
            Edit votable Pools
          </Button>
          <Button
            onClick={() => router.push(logPath)}
            isActive={currentPath === logPath ? true : false}
          >
            Cron Logs
          </Button>
        </HStack>
      </Card>
    </>
  );
};

export default AdminNav;
