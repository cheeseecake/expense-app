import {
  Button,
  FormControl,
  Radio,
  RadioGroup,
  Stack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { FormEvent, SyntheticEvent, useState } from "react";
import { AccountType } from "../../server/types";
import { trpc } from "./utils/trpc";

export const AddAccountButton = () => {
  const utils = trpc.useContext();
  const [name, setName] = useState<string>("");
  const [type, setType] = useState<AccountType>(AccountType.ASSET);
  const [opened, setOpened] = useState(false);
  const accountCreator = trpc.createAccount.useMutation({
    // Refresh acccounts upon mutation
    onSuccess: () => {
      utils.getAccounts.invalidate();
    },
  });
  const handleCreate = (e: FormEvent) => {
    e.preventDefault();
    accountCreator.mutate({ name: name, type: type });
  };
  return (
    <>
      <Modal isOpen={opened} onClose={() => setOpened(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Account</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form>
              <FormControl>
                <RadioGroup
                  onChange={(type) => setType(type as AccountType)}
                  value={type}
                >
                  <Stack direction="row">
                    <Radio value="ASSET">ASSET</Radio>
                    <Radio value="LIABILTY">LIABILTY</Radio>
                    <Radio value="EXPENSE">EXPENSE</Radio>
                    <Radio value="INCOME">INCOME</Radio>
                  </Stack>
                </RadioGroup>
              </FormControl>
              <FormControl>
                <Input
                  type="name"
                  placeholder="Account name"
                  onChange={(e: SyntheticEvent<HTMLInputElement>) =>
                    setName(e.currentTarget.value)
                  }
                />
              </FormControl>
              <Button width="full" mt={4} type="submit" onClick={handleCreate}>
                Add
              </Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Button onClick={() => setOpened(true)}>Add Account</Button>
    </>
  );
};
