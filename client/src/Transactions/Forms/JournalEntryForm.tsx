import {
  Button,
  Spacer,
  Select,
  NumberInputField,
  NumberInput,
  Flex,
} from "@chakra-ui/react";

import React from "react";
import { useState, useEffect } from "react";

import { createCategorySchema } from "../../../../server/src/other.schema";

type InputProps = {
  item;
  index;
  remove;
  register;
  errors;
  categories: Array<
    createCategorySchema & {
      id: number;
    }
  >;
  accounts: Array<{
    account: string;
    categoryId: number;
    currencyId: number; // to change to string
    id: number;
    currencyRef: {
      id: number;
      currency: string;
    };
  }>;
};

export const JournalEntryForm = React.memo(
  React.forwardRef<HTMLDivElement, InputProps>(
    ({
      item,
      index,
      remove,
      register,
      errors,
      categories,
      accounts,
    }: InputProps) => {
      const typeList = [
        { id: 1, type: "ASSET" },
        { id: 2, type: "LIABILITY" },
        { id: 3, type: "INCOME" },
        { id: 4, type: "EXPENSE" },
      ];
      const [selectedType, setSelectedType] = useState<number>(item.typeId);
      const [categoryList, setCategoryList] = useState<
        Array<
          createCategorySchema & {
            id: number;
          }
        >
      >([]);
      const [selectedCategory, setSelectedCategory] = useState<number>(
        item.categoryId
      );
      const [accountList, setAccountList] = useState<
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
      const [selectedAccount, setSelectedAccount] = useState<number>(
        item.accountId
      );

      useEffect(() => {
        let filteredCategoryList = categories?.filter(
          (item) => item.typeId === selectedType
        );
        filteredCategoryList = [...new Set(filteredCategoryList)];
        setCategoryList(filteredCategoryList);
        setSelectedCategory(filteredCategoryList[0]?.id);
      }, [selectedType, setCategoryList]);

      useEffect(() => {
        let filteredAccountList = accounts?.filter(
          (item) => item.categoryId === selectedCategory
        );
        filteredAccountList = [...new Set(filteredAccountList)];
        setAccountList(filteredAccountList);
        setSelectedAccount(filteredAccountList[0]?.id);
      }, [selectedType, selectedCategory, setAccountList]);

      return (
        <Flex key={item.id} gap="2" mt="2">
          <Select
            {...register(`journalEntries.${index}.typeId`)}
            onChange={(e) => {
              setSelectedType(Number(e.target.value));
            }}
          >
            {typeList?.map(({ id, type }) => (
              <option key={id} value={id}>
                {type}
              </option>
            ))}
          </Select>
          <Spacer />
          <Select
            {...register(`journalEntries.${index}.categoryId`)}
            onChange={(e) => {
              setSelectedCategory(Number(e.target.value));
            }}
          >
            {categoryList?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.category}
              </option>
            ))}
          </Select>
          <Spacer />
          <Select {...register(`journalEntries.${index}.accountId`)}>
            {accountList?.map(({ account, currencyRef, id }) => (
              <option key={id} value={id}>
                {account} ({currencyRef.currency})
              </option>
            ))}
          </Select>
          <Spacer />
          <NumberInput>
            <NumberInputField
              {...register(`journalEntries.${index}.amount`, {
                required: true,
              })}
            />
            {errors?.journalEntries?.[index]?.amount?.message && (
              <p style={{ color: "red" }}>
                {errors?.journalEntries?.[index]?.amount?.message}
              </p>
            )}
          </NumberInput>

          <Spacer />
          <Button onClick={() => remove(index)}>x</Button>
        </Flex>
      );
    }
  )
);
