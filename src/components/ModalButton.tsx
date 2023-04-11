import { Button } from "@chakra-ui/react";

export interface ButtonData {
  text: string;
  disabled: boolean;
  action: () => void;
}

export const ModalButton: React.FC<ButtonData> = (data) => {
  return (
    <Button
colorScheme='gray'
  fontSize='0.8rem'
      size='sm'
      width="100px"
      height="24px"
      disabled={data.disabled}
      onClick={data.action}>
      {data.text}
    </Button>
  );
};

