import {
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import type { Tokendata } from "types/bribedata.raw";

interface modalProps {
  data: Tokendata;
  lasttokens?: Tokendata[];
  isNew: boolean;
  onSubmit: (payload: Tokendata) => void;
}

export function EditTokenModal(props: modalProps) {
  const { data, lasttokens, isNew, onSubmit } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [tokenaddress, setTokenaddress] = useState<string | undefined>(undefined);
  const [coingeckoid, setCoingeckoid] = useState<string | undefined>(undefined);
  const [bptpoolid, setBptpoolid] = useState<string | undefined>(undefined);
  const [isbpt, setIsbpt] = useState<boolean | undefined>(undefined);
  const [lastprice, setLastprice] = useState<string | undefined>(undefined);
  const [token, setToken] = useState("");
  const [tokenId, setTokenId] = useState(0);
  const [tokenList, setTokenList] = useState<Tokendata[] | undefined>(undefined);

  const save = () => {
    const payload = {
      tokenaddress: tokenaddress || undefined,
      coingeckoid: coingeckoid || undefined,
      bptpoolid: bptpoolid || undefined,
      isbpt: !!isbpt,
      lastprice: Number(lastprice) || undefined,
      token: token,
      tokenId: tokenId || 0,
    };
    onSubmit(payload);
    onClose();
  };

  const openModal = () => {
    if (data) {
      console.log("set token values");
      setTokenaddress(data.tokenaddress || undefined);
      setCoingeckoid(data.coingeckoid || undefined);
      setBptpoolid(data.bptpoolid || undefined);
      setIsbpt(data.isbpt || undefined);
      setLastprice((data.lastprice || "").toString());
      setToken(data.token);
      setTokenId(data.tokenId);
    }
    if (lasttokens) {
      setTokenList(lasttokens);
    }
    onOpen();
  };

  const autofill = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newtoken = tokenList?.find(t => t.token === e.target.value);
    if (!newtoken || newtoken.token === "") return;
    console.log("newtoken: ", newtoken.token);
    setToken(newtoken.token);
    setTokenaddress(newtoken.tokenaddress || undefined);
    setCoingeckoid(newtoken.coingeckoid || undefined);
    setBptpoolid(newtoken.bptpoolid || undefined);
    setIsbpt(newtoken.isbpt || undefined);
    setTokenId(0);
  };

  return (
    <>
      <Button onClick={openModal}>{isNew ? "Add New Token" : "Edit"}</Button>

      <Modal closeOnOverlayClick={false} blockScrollOnMount isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Token</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <VStack align="left">
                {isNew && (
                  <FormControl isDisabled={!tokenList || tokenList.length < 1}>
                    <FormLabel>Copy from previous Round</FormLabel>
                    <Select value={token || ""} onChange={autofill}>
                      {[{ token: "", tokenId: 0 }, ...(tokenList || [])].map((tkn, index) => (
                        <option key={index} value={tkn.token}>
                          {tkn.token}
                        </option>
                      ))}
                    </Select>{" "}
                  </FormControl>
                )}
                <FormControl isDisabled>
                  <FormLabel>Token ID</FormLabel>
                  <Input value={tokenId || ""} />
                </FormControl>
                <FormControl isDisabled={!isNew}>
                  <FormLabel>Token</FormLabel>
                  <Input value={token} onChange={e => setToken(e.target.value)} />
                </FormControl>
                <FormControl>
                  <FormLabel>Token Address</FormLabel>
                  <Input
                    placeholder="0x..."
                    value={tokenaddress || ""}
                    onChange={e => setTokenaddress(e.target.value)}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>CoinGecko ID</FormLabel>
                  <Input value={coingeckoid || ""} onChange={e => setCoingeckoid(e.target.value)} />
                </FormControl>
                <FormControl>
                  <FormLabel>BPT Pool-ID</FormLabel>
                  <HStack>
                    <Checkbox isChecked={isbpt} onChange={() => setIsbpt(!isbpt)} />
                    <Input
                      isDisabled={!isbpt}
                      value={bptpoolid || ""}
                      onChange={e => setBptpoolid(e.target.value)}
                    />
                  </HStack>
                </FormControl>
                <FormControl>
                  <FormLabel>Last Price</FormLabel>
                  <Input
                    type="number"
                    value={lastprice || ""}
                    onChange={e => setLastprice(e.target.value)}
                  />
                </FormControl>
              </VStack>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={save}>Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
