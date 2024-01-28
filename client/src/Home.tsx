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
  Image,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
} from "@chakra-ui/react";

import { Stats } from "./Stats";

import { TransactionsOverview } from "./Transactions/TransactionsOverview";
import { Transactions } from "./Transactions/Transactions";
// import { IncomeExpense } from "./IncomeExpense/IncomeExpense";
// import { Accounts } from "./AssetsLiabilities/AssetsLiabilities";
// import { GetDbsStatementButton } from "./Forms/GetDbsStatementButton";
import { useState, useEffect } from "react";

import { z } from "zod";
import { trpc } from "./utils/trpc";

export const Home = () => {
  const { data, isSuccess } = trpc.getTransactions.useQuery();
  const [filteredTransactions, setFilteredTransactions] = useState<
    Array<
      Omit<z.infer<typeof transactionSchema>, "createdAt"> & {
        createdAt: string;
        journalEntries: Array<{
          accountId: number;
          amount: number;
          name: string;
          type: number;
        }>;
      }
    >
  >([]);
  const minDateTime = new Date("2018-1-1").getTime();
  const maxDateTime = new Date().getTime();
  const [startDateTime, setStartDateTime] = useState<number>(minDateTime);
  const [endDateTime, setEndDateTime] = useState<number>(maxDateTime);

  useEffect(() => {
    // Will be called whenever dateRange and searchText change
    // Use those 2 values to update filteredTransactions
    if (!isSuccess) return;

    let filtered = data?.transactions.filter(
      (item) =>
        new Date(item.createdAt) >= new Date(startDateTime) &&
        new Date(item.createdAt) <= new Date(endDateTime)
    );
    setFilteredTransactions(filtered);
  }, [startDateTime, endDateTime, isSuccess, setFilteredTransactions]);
  return (
    <Container maxW="80%" padding="4" centerContent>
      <Flex gap={4} w="100%">
        <Image boxSize="50px" src="../public/capoo.gif" alt="capoo" />

        {/* <GetDbsStatementButton /> */}
        <Heading>{new Date(startDateTime).toDateString()}</Heading>
        <Spacer />

        <Heading>{new Date(endDateTime).toDateString()}</Heading>
      </Flex>
      <Flex w="100%">
        <RangeSlider
          defaultValue={[0, 100]}
          onChange={(val) => {
            setStartDateTime(
              minDateTime + (val[0] * (maxDateTime - minDateTime)) / 100
            );

            setEndDateTime(
              minDateTime + (val[1] * (maxDateTime - minDateTime)) / 100
            );
          }}
        >
          <RangeSliderTrack>
            <RangeSliderFilledTrack />
          </RangeSliderTrack>
          <RangeSliderThumb index={0} />
          <RangeSliderThumb index={1} />
        </RangeSlider>
      </Flex>

      <Flex w="100%">
        <Stats filteredTransactions={filteredTransactions} />
      </Flex>

      <Flex w="100%">
        <Tabs w="100%" isFitted variant="enclosed">
          <TabList>
            <Tab>Transactions</Tab>
            <Tab>Income Statement</Tab>
            <Tab>Balance Sheet</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <TransactionsOverview
                filteredTransactions={filteredTransactions}
              />
              <Transactions filteredTransactions={filteredTransactions} />
            </TabPanel>
            <TabPanel>
              {/* <IncomeStatement /> */}Top 5 expense catgories, daily/monthly
              view with time series
            </TabPanel>
            <TabPanel>{/* <BalanceSheet /> */}Growth/ return rate</TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
    </Container>
  );
};
