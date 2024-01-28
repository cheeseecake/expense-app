import {
  Grid,
  GridItem,
  Card,
  IconButton,
  CardBody,
  Spacer,
  Flex,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
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

export const JournalEntry = React.memo(
  React.forwardRef<HTMLDivElement, InputProps>(
    ({ item, virtualItem }: InputProps, ref) => {
      const length = item.journalEntries.length;
      return (
        <Card
          variant="outline"
          data-index={virtualItem.index}
          m={0}
          p={0}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            transform: `translateY(${virtualItem.start}px)`,
          }}
          ref={ref}
        >
          <CardBody m={1} p={0}>
            <Grid templateColumns="repeat(12, 1fr)" gap={1}>
              <GridItem rowSpan={length} colSpan={1} borderRight="1px">
                {new Date(item.createdAt).toLocaleDateString()}
                <Spacer />
                <IconButton aria-label="Edit" icon={<EditIcon />} size="xs" />
              </GridItem>
              <GridItem rowSpan={length} colSpan={3} borderRight="1px">
                {item.description}
              </GridItem>
              <GridItem rowSpan={length} colSpan={2} borderRight="1px">
                {item.counterparty}
              </GridItem>
              <GridItem rowSpan={length} colSpan={6}>
                {item.journalEntries.map((je, index) => {
                  return (
                    <Grid
                      templateColumns="repeat(4, 1fr)"
                      gap={4}
                      key={index}
                      borderBottom="1px"
                    >
                      <GridItem colSpan={3} borderRight="1px">
                        {je.account.account}
                      </GridItem>
                      <GridItem colSpan={1} borderRight="1px">
                        {je.amount}{" "}
                      </GridItem>
                    </Grid>
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
