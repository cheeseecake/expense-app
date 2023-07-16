import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  Heading,
  Input,
  Radio,
  RadioGroup,
  Stack,
} from "@chakra-ui/react";
import { FormEvent, SyntheticEvent, useState } from "react";
import { AccountType } from "../../server/db";
import { GetDbsStatementButton } from "./GetDbsStatementButton";
import { trpc } from "./utils/trpc";

export const Accounts = () => {
  const utils = trpc.useContext();
  const [name, setName] = useState<string>("");
  const [type, setType] = useState<AccountType>("ASSET");
  const accountList = trpc.getAccounts.useQuery();
  const accountCreator = trpc.createAccount.useMutation({
    onSuccess: () => {
      utils.getAccounts.invalidate();
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    accountCreator.mutate({ name: name, type: type });
  };
  // accountList.data?.map((item) => <Card>{item.name}</Card>);

  return (
    <Container>
      <GetDbsStatementButton />
      <Flex width="full" align="center" justifyContent="center">
        <Box p={2}>
          <Box textAlign="center">
            <Heading>Accounts</Heading>
          </Box>
          <Box my={4} textAlign="left">
            <form>
              <FormControl>
                <RadioGroup
                  onChange={(type) => setType(type as AccountType)}
                  value={type}
                >
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
                  onChange={(e: SyntheticEvent<HTMLInputElement>) =>
                    setName(e.currentTarget.value)
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
      <pre>{JSON.stringify(accountList.data, null, 2)}</pre>
    </Container>
  );
};
