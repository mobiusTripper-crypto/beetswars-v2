import { Button } from "@chakra-ui/react";

interface ButtonData {
  text: string;
  disabled: boolean;
  action: () => void;
}

export const ModalButton: React.FC<ButtonData> = data => {
  return (
    <Button
      colorScheme="gray"
      border="1px solid #567"
      fontSize="0.8rem"
      size="sm"
      width="111px"
      height="23px"
      disabled={data.disabled}
      onClick={data.action}
    >
      {data.text}
    </Button>
  );
};
