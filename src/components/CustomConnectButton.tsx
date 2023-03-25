import {
  Button,
  Popover,
  PopoverTrigger,
  IconButton,
  Icon,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  HStack,
} from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { GoQuestion as QuestionIcon } from "react-icons/go";

export const CustomConnectButton = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const account = useAccount(); // never used, as there is another "account" variable in parameter list
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        // authenticationStatus, //unused?
        mounted,
      }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <HStack>
                    <Button onClick={openConnectModal} type="button">
                      Connect Wallet
                    </Button>
                    <Popover placement="auto-start">
                      <PopoverTrigger>
                        <IconButton
                          isRound
                          height="0"
                          minWidth="0"
                          aria-label="Explain Item"
                          icon={<Icon boxSize="6" as={QuestionIcon} />}
                        />
                      </PopoverTrigger>
                      <PopoverContent>
                        <PopoverHeader fontWeight="semibold">Connect Wallet</PopoverHeader>
                        <PopoverBody>
                          Connecting your wallet to beetswars will display your rewards based on
                          your voting power. This app is safe and secure, as we use
                          industry-standard encryption and security protocols and never store or
                          access private information.
                        </PopoverBody>
                      </PopoverContent>
                    </Popover>
                  </HStack>
                );
              }

              if (chain.unsupported) {
                return (
                  <Button onClick={openChainModal} type="button">
                    Wrong network
                  </Button>
                );
              }
              return (
                <div>
                  <Button onClick={openAccountModal} type="button">
                    {account.displayName}
                  </Button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
