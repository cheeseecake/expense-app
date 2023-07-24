import {
  Container,
  SimpleGrid,
  Heading,
  Text,
  Stack,
  Card,
  CardBody,
} from "@chakra-ui/react";

import { GetDbsStatementButton } from "./GetDbsStatementButton";
import { AddAccountButton } from "./AddAccountButton";

import { trpc } from "./utils/trpc";

export const Accounts = () => {
  const utils = trpc.useContext();

  const accountList = trpc.getAccounts.useQuery();

  const accountRemover = trpc.deleteAccountById.useMutation({
    // Refresh acccounts upon mutation
    onSuccess: () => {
      utils.getAccounts.invalidate();
    },
  });

  const handleDelete = (id: number) => {
    accountRemover.mutate(id);
  };

  const cards = accountList.data?.map(({ name, type, id }, idx) => (
    <Card>
      <CardBody>
        <Heading size="md">{type}</Heading>
        <Text>
          {id}. {name}
        </Text>
        {/* <Button width="full" mt={4} type="submit" onClick={handleDelete(id)}>
          X
        </Button> */}
      </CardBody>
    </Card>
  ));
  return (
    <Container>
      <Stack spacing={4} direction="row" align="center">
        <GetDbsStatementButton />
        <AddAccountButton />
      </Stack>
      <Heading>Accounts</Heading>
      <SimpleGrid spacing={4} columns={3}>
        {cards}
      </SimpleGrid>
    </Container>
  );
};
