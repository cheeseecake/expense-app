import {
  Container,
  Spacer,
  Flex,
  Grid,
  Heading,
  GridItem,
} from "@chakra-ui/react";

import { GetDbsStatementButton } from "./GetDbsStatementButton";
import { Form } from "./Form";
import { Transactions } from "./Transactions";
import { Accounts } from "./Accounts";
import { useState } from "react";

export const Home = () => {
  const [date] = useState<Date>(new Date());

  return (
    <Container maxW="80%" centerContent>
      <Flex>
        <Heading>{date.toDateString()}</Heading>
      </Flex>
      <Flex gap={4}>
        <Form />
        <Spacer />
        <GetDbsStatementButton />
      </Flex>
      <Flex>
        <Grid
          templateRows="repeat(1, 1fr)"
          templateColumns="repeat(5, 1fr)"
          gap={4}
        >
          <GridItem rowSpan={1} colSpan={1}>
            Accounts
            <Accounts />
          </GridItem>
          <GridItem rowSpan={1} colSpan={4}>
            Transactions
            <Transactions />
          </GridItem>
        </Grid>
      </Flex>
    </Container>
  );
};
