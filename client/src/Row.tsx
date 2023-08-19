import { Tr, Td } from "@chakra-ui/react";
import React from "react";

export const Row = React.memo(({ item }) => {
  return (
    <Tr>
      <Td verticalAlign={"top"}>{item.createdAt}</Td>
      <Td verticalAlign={"top"}>{item.description}</Td>
      <Td verticalAlign={"top"}>{item.counterparty}</Td>
      <Td verticalAlign={"top"}>
        {item.JournalEntry.map((je, index) => {
          return (
            <Tr key={je.id}>
              <Td>{je.accountId}</Td>
              <Td>{je.amount}</Td>
            </Tr>
          );
        })}
      </Td>
    </Tr>
  );
});
