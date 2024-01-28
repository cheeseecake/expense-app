import {
  Stat,
  StatLabel,
  StatNumber,
  Box,
  Text,
  StatGroup,
  Input,
  Container,
  Flex,
  Divider,
  Select,
} from "@chakra-ui/react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useCallback, useRef, useState, useEffect, useMemo } from "react";
import { JournalEntry } from "../Transactions/JournalEntry";
import { z } from "zod";
import { trpc } from "../utils/trpc";

const monthOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export const IncomeExpense = () => {
  const { data, isSuccess } = trpc.getTransactions.useQuery();
  const [filteredTransactions, setFilteredTransactions] = useState<
    Array<
      Omit<z.infer<typeof transactionSchema>, "createdAt"> & {
        createdAt: string;
        journalEntries: Array<{
          accountId: number;
          amount: number;
          name: string;
          type: AccountType;
        }>;
      }
    >
  >([]);

  const yearsOptions = useMemo(
    () => [
      ...new Set(
        data?.transactions.map((item) => new Date(item.createdAt).getFullYear())
      ),
    ],
    [data]
  );

  const [selectedYear, setSelectedYear] = useState<number | undefined>(
    new Date().getFullYear()
  );

  const [selectedMonth, setSelectedMonth] = useState<number | undefined>(
    new Date().getMonth() + 1
  );

  const [searchText, setSearchText] = useState<string>();

  const onYearChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = Number(e.target.value);
      if (value) {
        setSelectedYear(value);
      } else {
        setSelectedYear(undefined);
      }
    },
    [setSelectedYear]
  );
  const onMonthChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = Number(e.target.value);
      if (value) {
        setSelectedMonth(value);
      } else {
        setSelectedMonth(undefined);
      }
    },
    [setSelectedMonth]
  );
  const onSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.target.value),
    []
  );

  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: filteredTransactions.length ?? 0,
    estimateSize: () => 300,
    overscan: 5,
    getScrollElement: () => parentRef.current,
  });

  useEffect(() => {
    // Will be called whenever dateRange and searchText change
    // Use those 2 values to update filteredTransactions
    if (!isSuccess) return;

    let filtered = data?.transactions;

    if (selectedYear) {
      filtered = filtered.filter(
        (item) => new Date(item.createdAt).getFullYear() === selectedYear
      );
    }

    if (selectedMonth) {
      filtered = filtered.filter(
        (item) => new Date(item.createdAt).getMonth() + 1 === selectedMonth
      );
    }

    if (searchText != null) {
      filtered = filtered?.filter(
        (item) =>
          item.description.toLowerCase().search(searchText.toLowerCase()) !=
            -1 ||
          item.counterparty.toLowerCase().search(searchText.toLowerCase()) != -1
      );
    }
    setFilteredTransactions(filtered);
  }, [selectedMonth, selectedYear, isSuccess, searchText]);

  const totalIncome = useMemo(() => {
    const journalEntries = [];
    filteredTransactions.forEach((transaction) => {
      if (transaction.journalEntries) {
        journalEntries.push(...transaction.journalEntries);
      }
    });
    return journalEntries
      .filter((obj) => obj.type === "INCOME")
      .reduce((acc, obj) => acc + obj.amount, 0);
  }, [filteredTransactions]);

  const totalExpense = useMemo(() => {
    const journalEntries = [];
    filteredTransactions.forEach((transaction) => {
      if (transaction.journalEntries) {
        journalEntries.push(...transaction.journalEntries);
      }
    });
    return journalEntries
      .filter((obj) => obj.type === "EXPENSE")
      .reduce((acc, obj) => acc + obj.amount, 0);
  }, [filteredTransactions]);
  return (
    <div>
      <Flex gap={4} my={4}>
        <Box>
          <Text>Year</Text>
          <Select value={selectedYear} onChange={onYearChange}>
            <option key="All" value={undefined}>
              All
            </option>
            {yearsOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
          <Text>Month</Text>
          <Select value={selectedMonth} onChange={onMonthChange}>
            <option key={"all"} value={undefined}>
              All
            </option>
            {monthOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </Box>
        <Box flex="1">
          <StatGroup>
            <Stat>
              <StatLabel>Total Income</StatLabel>
              <StatNumber>
                {Math.abs(totalIncome)?.toLocaleString("en-US", {
                  style: "currency",
                  currency: "SGD",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </StatNumber>
            </Stat>

            <Stat>
              <StatLabel>Total Expense</StatLabel>
              <StatNumber>
                {" "}
                {Math.abs(totalExpense)?.toLocaleString("en-US", {
                  style: "currency",
                  currency: "SGD",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </StatNumber>
            </Stat>
            <Stat>
              <StatLabel>Expense Ratio</StatLabel>
              <StatNumber>
                {" "}
                {Math.abs(totalExpense / totalIncome)?.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </StatNumber>
            </Stat>
          </StatGroup>
          <Divider />
          <Box>
            <Flex>
              <Text>Donut Chart</Text>
              <Text flex="1">Time Series</Text>
            </Flex>
          </Box>
        </Box>
      </Flex>
    </div>
  );
};
