import { Link, Card, Button, HStack } from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";

export const AdminNav = () => {
  const router = useRouter();
  const currentPath = router.pathname;
  const adminPath = "/admin";
  const bribeformPath = "/bribeform";
  const poolPath = "/editVotablePools";

  return (
    <>
      <Card m={6} p={2}>
        <HStack gap={6}>
          <Link as={NextLink} href={adminPath}>
            <Button isActive={currentPath === adminPath ? true : false}>Admin</Button>
          </Link>
          <Link as={NextLink} href={bribeformPath}>
            <Button isActive={currentPath === bribeformPath ? true : false}>Bribe Forms</Button>
          </Link>
          <Link as={NextLink} href={poolPath}>
            <Button isActive={currentPath === poolPath ? true : false}>Edit votable Pools</Button>
          </Link>
        </HStack>
      </Card>
    </>
  );
};

export default AdminNav;
