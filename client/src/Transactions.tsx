import {
  TableContainer,
  Table,
  TableCaption,
  Thead,
  Tbody,
  Tr,
  Th,
} from "@chakra-ui/react";
import { Row } from "./Row";
import { trpc } from "./utils/trpc";

export type Expense = {
  description: string;
  amount: number;
  date: Date;
};

export const Transactions = () => {
  const transactionList = trpc.getTransactions.useQuery();

  return (
    <TableContainer>
      <Table variant="simple">
        {/* <TableCaption>{JSON.stringify(transactionList.data)}</TableCaption> */}
        <Thead>
          <Tr>
            <Th>Date</Th>
            <Th>Description</Th>
            <Th>Counter Party</Th>
            <Th>Journal Entry</Th>
          </Tr>
        </Thead>
        <Tbody>
          {transactionList?.data?.map((item, index) => {
            return <Row key={item.id} item={item} />;
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
