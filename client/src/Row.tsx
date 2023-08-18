import { Tr, Td } from "@chakra-ui/react";
import React from "react";

export const Row = React.memo(({ item }) => {
  console.log(item.JournalEntry);
  return (
    <Tr>
      <Td>{item.createdAt}</Td>
      <Td>{item.description}</Td>
      <Td>{item.counterParty}</Td>
      <Td>
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
