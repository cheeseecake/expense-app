import {
  Grid,
  GridItem,
  Card,
  SimpleGrid,
  Box,
  CardBody,
} from "@chakra-ui/react";
import { VirtualItem } from "@tanstack/react-virtual";
import React from "react";
import { z } from "zod";
import { transactionSchema } from "../../../server/types";

type InputProps = {
  virtualItem: VirtualItem;
  item: Omit<z.infer<typeof transactionSchema>, "createdAt"> & {
    createdAt: string;
  };
};

export const Transaction = React.memo(
  React.forwardRef<HTMLDivElement, InputProps>(
    ({ item, virtualItem }: InputProps, ref) => {
      const length = item.JournalEntry.length;
      return (
        <Card
          variant="outline"
          data-index={virtualItem.index}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            transform: `translateY(${virtualItem.start}px)`,
          }}
          ref={ref}
        >
          <CardBody>
            <Grid templateColumns="repeat(10, 1fr)" gap={4}>
              <GridItem rowSpan={length} colSpan={1}>
                {new Date(item.createdAt).toLocaleDateString()}
              </GridItem>
              <GridItem rowSpan={length} colSpan={3}>
                {item.description}
              </GridItem>
              <GridItem rowSpan={length} colSpan={2}>
                {item.counterparty}
              </GridItem>
              <GridItem rowSpan={length} colSpan={4}>
                {item.JournalEntry.map((je, index) => {
                  return (
                    <SimpleGrid columns={2} gap={2} key={index}>
                      <Box>{je.accountId}</Box>
                      <Box>{je.amount}</Box>
                    </SimpleGrid>
                  );
                })}
              </GridItem>
            </Grid>
          </CardBody>
        </Card>
      );
    }
  )
);
