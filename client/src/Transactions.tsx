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
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import {
  FormEvent,
  SyntheticEvent,
  useCallback,
  useMemo,
  useState,
} from "react";
import { Row } from "./Row";

export type Expense = {
  description: string;
  amount: number;
  date: Date;
};

export const Transactions = () => {
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

  const setItemValue = useCallback(
    (v: string, idx: number, key: keyof Expense) => {
      let parsedVal: string | number = v;
      if (key == "amount") {
        parsedVal = parseFloat(v);
      }
      setValue((v) => {
        v.splice(idx, 1, { ...v[idx], [key]: parsedVal });
        return [...v];
      });
    },
    []
  );

  const rows = useMemo(
    () =>
      values.map(({ date, description, amount }, idx) => (
        <Row
          key={idx}
          date={date}
          description={description}
          amount={amount}
          idx={idx}
          setItemValue={setItemValue}
        />
      )),
    [values, setItemValue]
  );

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
                  onChange={(e: SyntheticEvent<HTMLInputElement>) =>
                    setDescription(e.currentTarget.value)
                  }
                />
              </FormControl>
              <FormControl mt={6}>
                <FormLabel>Amount</FormLabel>
                <Input
                  type="amount"
                  placeholder="11.80"
                  onChange={(e: SyntheticEvent<HTMLInputElement>) =>
                    setAmount(parseFloat(e.currentTarget.value))
                  }
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
          <Tbody>{rows}</Tbody>
        </Table>
      </TableContainer>
    </Container>
  );
};
