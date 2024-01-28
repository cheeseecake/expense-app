import { Flex, Input, Container, Card } from "@chakra-ui/react";
import { JournalEntry } from "./JournalEntry";
import React from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useCallback, useRef, useState } from "react";

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

export const Transactions = React.memo(
  React.forwardRef<HTMLDivElement, InputProps>(
    ({ filteredTransactions }: InputProps) => {
      const [searchText, setSearchText] = useState<string>();

      const onSearchChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) =>
          setSearchText(e.target.value),
        []
      );

      const parentRef = useRef<HTMLDivElement>(null);

      const virtualizer = useVirtualizer({
        count: filteredTransactions.length ?? 0,
        estimateSize: () => 300,
        overscan: 5,
        getScrollElement: () => parentRef.current,
      });

      return (
        <>
          <Flex>
            <Input
              value={searchText}
              onChange={onSearchChange}
              placeholder="Search..."
              size="sm"
            />
          </Flex>

          {/* Viewport Div. What the user can see.*/}
          <Card
            ref={parentRef}
            variant="outline"
            boxShadow="dark-lg"
            style={{
              height: 500,
              width: "100%",
              overflow: "auto",
              contain: "strict",
              border: "1px",
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
                <JournalEntry
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
          </Card>
        </>
      );
    }
  )
);
