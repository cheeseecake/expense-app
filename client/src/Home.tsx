import {
  Container,
  Spacer,
  Flex,
  Tabs,
  Tab,
  Heading,
  TabPanel,
  TabList,
  TabPanels,
} from "@chakra-ui/react";

import { GetDbsStatementButton } from "./Forms/GetDbsStatementButton";
import { Form } from "./Forms/Form";
import { IncomeExpense } from "./IncomeExpense/IncomeExpense";
import { useState } from "react";
import { Accounts } from "./AssetsLiabilities/AssetsLiabilities";

export const Home = () => {
  const [date] = useState<Date>(new Date());

  return (
    <Container maxW="80%" padding="4" centerContent>
      <Flex gap={4} w="100%">
        <Heading>{date.toDateString()}</Heading>
        <Spacer />
        <Form />
        <GetDbsStatementButton />
      </Flex>
      <Flex w="100%">
        <Tabs w="100%" variant="enclosed">
          <TabList>
            <Tab>Income & Expenses</Tab>
            <Tab>Assets & Liabilities</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <IncomeExpense />
            </TabPanel>
            <TabPanel>
              <Accounts />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
    </Container>
  );
};
