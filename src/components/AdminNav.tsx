import { Link, Card, Button, HStack } from "@chakra-ui/react";
import NextLink from "next/link";

export const AdminNav = () => {
  return (
      <>
        <Card m={6} p={2}>
          <HStack gap={6}>
            <Link as={NextLink} href="/admin">
              <Button>Admin</Button>
            </Link>
            <Link as={NextLink} href="/bribeform">
              <Button>Bribe Forms</Button>
            </Link>
            <Link as={NextLink} href="/editVotablePools">
              <Button>Edit votable Pools</Button>
            </Link>
          </HStack>
        </Card>
    </>
  );
};

export default AdminNav;
