import {
  Button,
  FormControl,
  VStack,
  Input,
  FormLabel,
  useToast,
  Select,
  Flex,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import React from "react";
import { trpc } from "../../utils/trpc";
import { AccountTypeRadios } from "./TypeRadio";
import { createAccountSchema } from "../../../../server/src/account.schema";
import {
  createCurrencySchema,
  createCategorySchema,
} from "../../../../server/src/other.schema";

type InputProps = {
  categories: Array<
    createCategorySchema & {
      id: number;
    }
  >;
};

export const AccountForm = React.memo(
  React.forwardRef<HTMLDivElement, InputProps>(({ categories }: InputProps) => {
    const { data, isSuccess } = trpc.getCurrencies.useQuery();
    const [currencies, setCurrencies] = useState<
      Array<
        createCurrencySchema & {
          id: number;
        }
      >
    >([]);

    const [selectedType, setSelectedType] = useState<number>(1);
    const [categoryList, setCategoryList] = useState<
      Array<
        createCategorySchema & {
          id: number;
        }
      >
    >([]);
    const utils = trpc.useContext();
    const toast = useToast();
    const {
      register,
      handleSubmit,
      control,
      reset,
      formState: { errors },
    } = useForm<z.infer<typeof createAccountSchema>>({
      resolver: zodResolver(createAccountSchema),
      defaultValues: {
        typeId: "1",
        account: "",
        currencyId: 1,
        categoryId: 1,
      },
    });

    const accountCreator = trpc.createAccount.useMutation({
      // Refresh acccounts upon mutation
      onSuccess: () => {
        utils.getAccounts.invalidate();
        reset();
        toast({
          title: "Success",
          position: "top",
          description: "Account created!",
          status: "success",
        });
      },

      onError: (error) =>
        toast({
          title: "Error",
          position: "top",
          description: error.message,
          status: "error",
          isClosable: true,
          duration: null,
        }),
    });

    const onSubmit = (data: z.infer<typeof createAccountSchema>) =>
      accountCreator.mutate(data);
    useEffect(() => {
      if (!isSuccess) return;
      setCurrencies(data.currencies);
    }, [isSuccess]);
    useEffect(() => {
      if (!isSuccess) return;
      let filtered = categories.filter((item) => item.typeId == selectedType);

      setCategoryList(filtered);
    }, [isSuccess, selectedType]);

    return (
      <>
        <form>
          <VStack spacing={4} align="stretch">
            <Flex gap="2">
              <FormControl
                onChange={(e) => {
                  setSelectedType(e.target.value);
                }}
              >
                <FormLabel>Type</FormLabel>
                <AccountTypeRadios control={control} name="typeId" />
              </FormControl>
              <FormControl>
                <FormLabel>Category</FormLabel>
                <Select>
                  {categoryList.map((item) => (
                    <option key={item.id}>{item.category}</option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Currency</FormLabel>
                <Select>
                  {currencies.map((item) => (
                    <option key={item.id}>{item.currency}</option>
                  ))}
                </Select>
              </FormControl>
            </Flex>
            <FormControl>
              <FormLabel>Account</FormLabel>
              <Input {...register("account")} />
              {errors.account?.message && <p>{errors.account?.message}</p>}
            </FormControl>
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
