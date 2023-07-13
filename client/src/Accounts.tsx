import { trpc } from "./utils/trpc";
import { FormEvent, useState } from "react";
import {
  Card,
  CardBody,
  Text,
  Container,
  Button,
  Box,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  RadioGroup,
  Radio,
  Stack,
} from "@chakra-ui/react";

export type Account = {
  name: string;
  id: number;
  type: "ASSET" | "LIABILTY" | "INCOME" | "EXPENSE";
};

export const Accounts = () => {
  const [name, setName] = useState<string>("");
  const [type, setType] = useState("EXPENSE");
  const accountList = trpc.accountList.useQuery();
  const accountCreator = trpc.accountCreate.useMutation();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    accountCreator.mutate({ name: name, type: type });
  };

  return (
    <Container>
      <Flex width="full" align="center" justifyContent="center">
        <Box p={2}>
          <Box textAlign="center">
            <Heading>Accounts</Heading>
          </Box>
          <Box my={4} textAlign="left">
            <form>
              <FormControl>
                <RadioGroup onChange={setType} value={type}>
                  <Stack direction="row">
                    <Radio value="ASSET">ASSET</Radio>
                    <Radio value="LIABILTY">LIABILTY</Radio>
                    <Radio value="EXPENSE">EXPENSE</Radio>
                    <Radio value="INCOME">INCOME</Radio>
                  </Stack>
                </RadioGroup>
              </FormControl>
              <FormControl>
                <Input
                  type="name"
                  placeholder="Food"
                  onChange={(e) => setName(e.currentTarget.value)}
                />
              </FormControl>

              <Button width="full" mt={4} type="submit" onClick={handleSubmit}>
                Add
              </Button>
            </form>
          </Box>
        </Box>
      </Flex>

      <pre>{JSON.stringify(accountList.data, null, 2)}</pre>
    </Container>
  );
};
