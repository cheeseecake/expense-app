import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stat,
  StatLabel,
  StatNumber,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { FormEvent, useMemo, useState } from "react";
import { EditableField } from "./EditableField";

type Expense = {
  description: string;
  amount: number;
  date: Date;
};

export const App = () => {
  const [values, setValue] = useState<Array<Expense>>([]);
  const [description, setDescription] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [date] = useState<Date>(new Date());

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setValue([...values, { description, amount, date }]);
  };

  const total = useMemo(
    () => values.reduce((prevVal, { amount }) => prevVal + amount, 0),
    [values]
  );

  const setItemValue = (v: string, idx: number, key: keyof Expense) => {
    let parsedVal: string | number = v;
    if (key == "amount") {
      parsedVal = parseFloat(v);
    }
    values.splice(idx, 1, { ...values[idx], [key]: parsedVal });
    setValue([...values]);
  };

  return (
    <Container>
      <Flex width="full" align="center" justifyContent="center">
        <Box p={2}>
          <Box textAlign="center">
            <Heading>Expense</Heading>
            <Stat>
              <StatLabel>Totals</StatLabel>
              <StatNumber>{total}</StatNumber>
              <StatLabel>{date.toLocaleDateString()}</StatLabel>
            </Stat>
          </Box>
          <Box my={4} textAlign="left">
            <form>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Input
                  type="description"
                  placeholder="Whipping Cream 1L"
                  onChange={(e) => setDescription(e.currentTarget.value)}
                />
              </FormControl>
              <FormControl mt={6}>
                <FormLabel>Amount</FormLabel>
                <Input
                  type="amount"
                  placeholder="11.80"
                  onChange={(e) => setAmount(parseFloat(e.currentTarget.value))}
                />
              </FormControl>
              <Button width="full" mt={4} type="submit" onClick={handleSubmit}>
                Add
              </Button>
            </form>
          </Box>
        </Box>
      </Flex>
      <TableContainer>
        <Table variant="simple">
          <TableCaption>Expenses</TableCaption>
          <Thead>
            <Tr>
              <Th>Date</Th>
              <Th>Description</Th>
              <Th isNumeric>amount</Th>
            </Tr>
          </Thead>
          <Tbody>
            {values.map(({ date, description, amount }, idx) => (
              <Tr>
                <Td>{date.toLocaleDateString()}</Td>
                <Td>
                  <EditableField
                    value={description}
                    setValue={(val: string) =>
                      setItemValue(val, idx, "description")
                    }
                  />
                </Td>
                <Td isNumeric>
                  <EditableField
                    value={amount}
                    setValue={(val: string) => setItemValue(val, idx, "amount")}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Container>
  );
};
