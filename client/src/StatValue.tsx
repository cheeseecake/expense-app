import { StatNumber } from "@chakra-ui/react";

import React from "react";
import { useMemo } from "react";
type InputProps = {
  typeId: number;
  filteredTransactions;
};

export const StatValue = React.memo(
  React.forwardRef<HTMLDivElement, InputProps>(
    ({ typeId, filteredTransactions }: InputProps) => {
      const totalStat = useMemo(() => {
        const journalEntries = [];
        filteredTransactions.forEach((transaction) => {
          if (transaction.journalEntries) {
            journalEntries.push(...transaction.journalEntries);
          }
        });
        return journalEntries
          .filter((obj) => obj.account.categoryRef.typeId === typeId)
          .reduce((acc, obj) => acc + obj.amount, 0);
      }, [filteredTransactions]);

      return (
        <StatNumber>
          {" "}
          {Math.abs(totalStat)?.toLocaleString("en-US", {
            style: "currency",
            currency: "SGD",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </StatNumber>
      );
    }
  )
);
