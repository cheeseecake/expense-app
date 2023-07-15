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
import { trpc } from "./utils/trpc";

export const Accounts = () => {
  const [name, setName] = useState<string>("");
  const [type, setType] = useState<AccountType>("Something Invalid");
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
