import {
  Button,
  FormControl,
  ModalHeader,
  ModalOverlay,
  Input,
  Select,
  Modal,
  ModalContent,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";
import { useState } from "react";
import { trpc } from "./utils/trpc";
import { useForm, SubmitHandler } from "react-hook-form";

type TransactionInput = {
  description: string;
  counterparty: string;
  account: string;
};

export const AddTransactionButton = () => {
  const accountList = trpc.getAccounts.useQuery();
  const [opened, setOpened] = useState(false);

  const { register, handleSubmit } = useForm<TransactionInput>({
    // Read up about the options that useForm accepts
  });

    // TODO replace with the real trpc call, and handle/display validation errors accordingly

    /* Libraries for form validation:
    
    - prevent rerendering
    - validation - is the input the correct type?
    - validation - is the input the correct format? e.g. date, number
    - submission - show errors ONLY on the wrong fields
    
    react-hook-form
    
    Homework:
    
    - Read the react-hook-form website
    - Implement validation: string length, sum of values to be zero
        - Use Zod
    - Show error states*/
  const onSubmit:SubmitHandler<TransactionInput> = data => console.log(data)

  return (
    <>
      <Modal isOpen={opened} onClose={() => setOpened(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Transaction</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form>
              <FormControl>
                <Input {...register('description')} />
              </FormControl>
              <FormControl>
                <Input {...register('counterparty')} 

                />
              </FormControl>
              <FormControl>
                <Select placeholder="Select account" {...register('account')} >
                  {accountList.data?.map(({ name, id }) => (
                    <option
                      value={id}
                    >
                      {name}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <Button width="full" mt={4} type="submit" onClick={handleSubmit(onSubmit)}>
                Add
              </Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Button onClick={() => setOpened(true)}>Add Transaction</Button>
    </>
  );
};
