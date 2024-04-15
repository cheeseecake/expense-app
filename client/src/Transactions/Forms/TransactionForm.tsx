import {
  Button,
  FormControl,
  FormLabel,
  VStack,
  Input,
  Flex,
  Spacer,
  useToast,
  Select,
} from "@chakra-ui/react";

import React from "react";
import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "../../utils/trpc";
import { createTransactionSchema } from "../../../../server/src/transaction.schema";
import { createCategorySchema } from "../../../../server/src/other.schema";

import { JournalEntryForm } from "./JournalEntryForm";

type InputProps = {
  categories: Array<
    createCategorySchema & {
      id: number;
    }
  >;
};
export const TransactionForm = React.memo(
  React.forwardRef<HTMLDivElement, InputProps>(({ categories }: InputProps) => {
    const { data, isSuccess } = trpc.getAccounts.useQuery();
    const [accounts, setAccounts] = useState<
      Array<{
        account: string;
        categoryId: number;
        currencyId: number; // to change to string
        id: number;
        currencyRef: {
          id: number;
          currency: string;
        };
      }>
    >([]);

    const toast = useToast();
    const utils = trpc.useContext();
    const {
      register,
      handleSubmit,
      control,
      formState: { errors },
      reset,
    } = useForm({
      resolver: zodResolver(createTransactionSchema),
      defaultValues: {
        createdAt: new Date().toLocaleDateString("fr-CA"),
        description: "",
        counterparty: "",
        journalEntries: [
          { typeId: 4, categoryId: 16, accountId: 156, amount: 5 },
          { typeId: 2, categoryId: 1, accountId: 210, amount: -5 },
        ],
      },
    });
    const { fields, remove, append } = useFieldArray({
      control,
      name: "journalEntries",
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

    const onSubmit = (data: z.infer<typeof createTransactionSchema>) => {
      console.log(data);
      txnCreator.mutate(data);
    };
    useEffect(() => {
      if (!isSuccess) return;
      setAccounts(data.accounts);
    }, [isSuccess]);
    return (
      <>
        <form>
          <VStack spacing={4} align="stretch">
            <Flex gap="2">
              <FormControl>
                <FormLabel>Recurrence</FormLabel>
                <Select>
                  <option>One-time</option>
                  <option>Monthly</option>
                  <option>Yearly</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Date</FormLabel>
                <Input type="date" {...register("createdAt")} />
                {errors.createdAt?.message && (
                  <p>{errors.createdAt?.message}</p>
                )}
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
              <FormLabel>Journal Entries</FormLabel>
              {errors.journalEntries?.message && (
                <p>{errors.journalEntries?.message}</p>
              )}
              <Spacer />
              <Button
                onClick={() => {
                  append({
                    typeId: 1,
                    categoryId: 1,
                    accountId: 1,
                    amount: 10,
                  });
                }}
              >
                +
              </Button>
            </Flex>
            <ul>
              {fields.map((item, index) => (
                <JournalEntryForm
                  key={item.id}
                  item={item}
                  index={index}
                  remove={remove}
                  register={register}
                  errors={errors}
                  categories={categories}
                  accounts={accounts}
                />
              ))}
            </ul>
            <Button
              width="full"
              mt={4}
              type="submit"
              onClick={handleSubmit(onSubmit)}
            >
              Save
            </Button>
          </VStack>
        </form>
      </>
    );
  })
);
