import { Box, Stat, StatLabel, StatGroup, Flex } from "@chakra-ui/react";
import { StatValue } from "./StatValue";
import React from "react";
import { z } from "zod";
import { transactionSchema } from "../../../server/types";

type InputProps = {
  filteredTransactions: Array<
    Omit<z.infer<typeof transactionSchema>, "createdAt"> & {
      createdAt: string;
      journalEntries: Array<{
        accountId: number;
        amount: number;
        name: string;
        type: number;
      }>;
    }
  >;
};

export const Stats = React.memo(
  React.forwardRef<HTMLDivElement, InputProps>(
    ({ filteredTransactions }: InputProps) => {
      return (
        <Flex gap={4} my={4} w="100%">
          <Box flex="1">
            <StatGroup>
              <Stat>
                <StatLabel>Total Income</StatLabel>
                <StatValue
                  typeId={3}
                  filteredTransactions={filteredTransactions}
                />
              </Stat>

              <Stat>
                <StatLabel>Total Expense</StatLabel>
                <StatValue
                  typeId={4}
                  filteredTransactions={filteredTransactions}
                />
              </Stat>

              <Stat>
                <StatLabel>Total Assets</StatLabel>
                <StatValue
                  typeId={1}
                  filteredTransactions={filteredTransactions}
                />
              </Stat>

              <Stat>
                <StatLabel>Total Liabilities</StatLabel>
                <StatValue
                  typeId={2}
                  filteredTransactions={filteredTransactions}
                />
              </Stat>
            </StatGroup>
          </Box>
        </Flex>
      );
    }
  )
);
