import { Expense } from "./App";
import { EditableField } from "./EditableField";
import { Tr, Td } from "@chakra-ui/react";
import React from "react";

type InputProps = {
  date: Date;
  description: string;
  amount: number;
  idx: number;
  setItemValue: (v: string, idx: number, key: keyof Expense) => void;
};

export const Row = React.memo(
  ({ date, description, amount, idx, setItemValue }: InputProps) => {
    return (
      <Tr>
        <Td>{date.toLocaleDateString()}</Td>
        <Td>
          <EditableField
            value={description}
            setValue={(val: string) => setItemValue(val, idx, "description")}
          />
        </Td>
        <Td isNumeric>
          <EditableField
            value={amount}
            setValue={(val: string) => setItemValue(val, idx, "amount")}
          />
        </Td>
      </Tr>
    );
  }
);
