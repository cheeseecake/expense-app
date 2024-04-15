import { AddForm } from "./Forms/AddForm";
import { UploadTransactionsForm } from "./Forms/UploadTransactionsForm";
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

export const TransactionsOverview = React.memo(
  React.forwardRef<HTMLDivElement, InputProps>(
    ({ filteredTransactions }: InputProps) => {
      return (
        <>
          <AddForm />{' '}<UploadTransactionsForm />
        </>
      );
    }
  )
);
