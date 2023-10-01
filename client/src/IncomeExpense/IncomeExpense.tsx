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
import { useCallback, useRef, useState, useEffect } from "react";
import { Transaction } from "./JournalEntry";
import { z } from "zod";
import { transactionSchema } from "../../../server/types";
import { trpc } from "../utils/trpc";

export const IncomeExpense = () => {
  const { data, isSuccess } = trpc.getTransactions.useQuery();
  const [filteredTransactions, setFilteredTransactions] = useState<
    Array<
      Omit<z.infer<typeof transactionSchema>, "createdAt"> & {
        createdAt: string;
      }
    >
  >([]);

  const options = [
    { value: "1", text: "Current Month" },
    { value: "2", text: "Current Year" },
    { value: "3", text: "All" },
  ];

  const [period, setPeriod] = useState<string>(options[0].value);

  const [searchText, setSearchText] = useState<string>("");

  const onPeriodChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setPeriod(e.target.value),
    []
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

    let filtered;

    if (period == "1") {
      filtered = data?.filter(
        (item) =>
          new Date(item.createdAt).getMonth() == new Date().getMonth() &&
          new Date(item.createdAt).getFullYear() == new Date().getFullYear()
      );
    } else if (period == "2") {
      filtered = data?.filter(
        (item) =>
          new Date(item.createdAt).getFullYear() == new Date().getFullYear()
      );
    } else {
      filtered = data;
    }

    if (searchText != null) {
      filtered = filtered?.filter(
        (item) =>
          item.description.toLowerCase().search(searchText.toLowerCase()) != -1
      );
    }
    setFilteredTransactions(filtered);
  }, [period, isSuccess, searchText]);
  return (
    <div>
      <StatGroup>
        <Stat>
          <StatLabel>Total Income</StatLabel>
          <StatNumber>$3,670</StatNumber>
        </Stat>

        <Stat>
          <StatLabel>Total Expense</StatLabel>
          <StatNumber>$945.90</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Expense Ratio</StatLabel>
          <StatNumber>25.7%</StatNumber>
        </Stat>
      </StatGroup>
      <Divider />
      <Flex gap={4}>
        <Box>
          <Select value={period} onChange={onPeriodChange}>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.text}
              </option>
            ))}
          </Select>
          <Text>Donut Chart</Text>
        </Box>
        <Box flex="1">
          <Text>Time Series</Text>
        </Box>
      </Flex>
      <Flex>
        <Input
          value={searchText}
          onChange={onSearchChange}
          placeholder="Search..."
          size="sm"
        />
      </Flex>

      {/* Viewport Div. What the user can see.*/}
      <div
        ref={parentRef}
        style={{
          height: 400,
          width: "100%",
          overflow: "auto",
          contain: "strict",
        }}
      >
        {/* Content Div. Must be large enough to hold everything. Can be larger than the Viewport Div.*/}
        <Container
          style={{
            height: virtualizer.getTotalSize(),
            position: "relative", // So that children will be positioned relatively

            maxWidth: "100%",
          }}
        >
          {virtualizer.getVirtualItems().map((virtualItem) => (
            <Transaction
              key={virtualItem.key}
              virtualItem={virtualItem}
              item={
                filteredTransactions[virtualItem.index] as Omit<
                  z.infer<typeof transactionSchema>,
                  "createdAt"
                > & { createdAt: string }
              }
              ref={virtualizer.measureElement}
            />
          ))}
        </Container>
      </div>
    </div>
  );
};
