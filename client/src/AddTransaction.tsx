import {
  Button,
  FormControl,
  FormLabel,
  VStack,
  Input,
  Flex,
  Spacer,
  Select,
  NumberInputField,
  NumberInput,
  useToast,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { trpc } from "./utils/trpc";
import { transactionSchema } from "./validationSchema";

export const AddTransaction = () => {
  const accountList = trpc.getAccounts.useQuery();
  const toast = useToast();
  const utils = trpc.useContext();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      createdAt: new Date().toLocaleDateString("fr-CA"),
      description: "Purchased XXX",
      counterparty: "ABC",
      accounts: [
        { accountId: 1, amount: 5 },
        { accountId: 2, amount: -5 },
      ],
    },
  });
  const { fields, remove, append } = useFieldArray({
    control,
    name: "accounts",
  });
  const txnCreator = trpc.createTransaction.useMutation({
    onSuccess: () => {
      utils.getTransactions.invalidate();
      toast({
        title: "Success",
        position: "top",
        description: "Transaction created!",
        status: "success",
      });
      reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        position: "top",
        description: error.message,
        status: "error",
        isClosable: true,
        duration: null,
      });
    },
  });

  const onSubmit = (data: z.infer<typeof transactionSchema>) => {
    txnCreator.mutate(data);
  };

  return (
    <>
      <form>
        <VStack spacing={4} align="stretch">
          <Flex gap="2">
            <FormControl>
              <FormLabel>Date</FormLabel>
              <Input type="date" {...register("createdAt")} />
              {errors.createdAt?.message && <p>{errors.createdAt?.message}</p>}
            </FormControl>

            <FormControl>
              <FormLabel>Counterparty</FormLabel>
              <Input {...register("counterparty")} />
              {errors.counterparty?.message && (
                <p>{errors.counterparty?.message}</p>
              )}
            </FormControl>
          </Flex>
          <Flex gap="2">
            <FormControl>
              <FormLabel>Description</FormLabel>
              <Input {...register("description")} />
              {errors.description?.message && (
                <p>{errors.description?.message}</p>
              )}
            </FormControl>
          </Flex>
          <Flex>
            <FormLabel>Accounts</FormLabel>
            {errors.accounts?.message && <p>{errors.accounts?.message}</p>}
            <Spacer />
            <Button
              onClick={() => {
                append({ accountId: 1, amount: 10 });
              }}
            >
              +
            </Button>
          </Flex>
          <ul>
            {fields.map((item, index) => {
              return (
                <Flex key={item.id} gap="2" mt="2">
                  <Select
                    placeholder="Select account"
                    {...register(`accounts.${index}.accountId`)}
                  >
                    {accountList.data?.map(({ name, id }) => (
                      <option key={id} value={id}>
                        {name}
                      </option>
                    ))}
                  </Select>
                  <Spacer />

                  <NumberInput>
                    <NumberInputField
                      {...register(`accounts.${index}.amount`, {
                        required: true,
                      })}
                    />
                    {errors?.accounts?.[index]?.amount?.message && (
                      <p style={{ color: "red" }}>
                        {errors?.accounts?.[index]?.amount?.message}
                      </p>
                    )}
                  </NumberInput>

                  <Spacer />
                  <Button onClick={() => remove(index)}>x</Button>
                </Flex>
              );
            })}
          </ul>
          <Button
            width="full"
            mt={4}
            type="submit"
            onClick={handleSubmit(onSubmit)}
          >
            Create
          </Button>
        </VStack>
      </form>
    </>
  );
};
