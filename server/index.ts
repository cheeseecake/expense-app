import { Prisma, PrismaClient } from "@prisma/client";
import { initTRPC } from "@trpc/server";
import { createHTTPServer } from "@trpc/server/adapters/standalone";
import cors from "cors";
import { z } from "zod";
import { getDbsStatementAsCsv, getDbsStatementSchema } from "./getDbsStatement";
import { AccountType } from "./types";
import {
  transactionSchema,
  accountSchema,
} from "../client/src/validationSchema";

const t = initTRPC.create();

const prisma = new PrismaClient();

export const publicProcedure = t.procedure;
export const router = t.router;

const appRouter = router({
  getAccounts: publicProcedure.query(async () => {
    const counts = await prisma.journalEntry.groupBy({
      by: ["accountId"],
      _sum: {
        amount: true,
      },
    });

    const accounts = await prisma.account.findMany();

    return accounts.map((acc) => ({
      ...acc,
      _sum: counts.find((c) => c.accountId === acc.id)?._sum.amount,
    }));
  }),
  getAccountsByType: publicProcedure.input(z.string()).query(async (opts) => {
    const { input } = opts;
    // Retrieve the account with the given ID
    const accounts = await prisma.account.findMany({
      where: {
        type: input,
      },
    });
    return accounts;
  }),

  deleteAccountById: publicProcedure
    .input(z.number())
    .mutation(async (opts) => {
      const { input } = opts;
      // Delete the account with the given ID
      const account = await prisma.account.delete({
        where: {
          id: input,
        },
      });
      return account;
    }),

  createAccount: publicProcedure.input(accountSchema).mutation(async (opts) => {
    const { input } = opts;
    // Create a new account in the database
    const account = await prisma.account.create({
      data: {
        ...input,
      },
    });
    return account;
  }),

  getTransactions: publicProcedure.query(async () => {
    // Retrieve transactions
    const transactions = await prisma.transaction.findMany({
      include: {
        JournalEntry: true, // Include the related journal entries
      },
    });
    return transactions;
  }),

  getTransactionsById: publicProcedure.input(z.number()).query(async (opts) => {
    const { input } = opts;
    // Retrieve the account with the given ID
    const transaction = await prisma.transaction.findUnique({
      where: {
        id: input,
      },
    });
    return transaction;
  }),

  deleteTransactionById: publicProcedure
    .input(z.number())
    .mutation(async (opts) => {
      const { input } = opts;
      // Delete the account with the given ID
      const transaction = await prisma.transaction.delete({
        where: {
          id: input,
        },
      });
      return transaction;
    }),

  createTransaction: publicProcedure
    .input(transactionSchema)
    .mutation(async (opts) => {
      const { input } = opts;
      const transaction = await prisma.transaction.create({
        data: {
          createdAt: input.createdAt,
          description: input.description,
          counterParty: input.counterparty,
          JournalEntry: {
            create: input.accounts,
          },
        },
        include: {
          JournalEntry: true,
        },
      });
      return transaction;
    }),

  getDbsStatementAsCsv: publicProcedure
    .input(getDbsStatementSchema)
    .mutation(async ({ input }) => await getDbsStatementAsCsv(input)),
});

/* Export only the type */
export type AppRouter = typeof appRouter;

// create server
createHTTPServer({
  middleware: cors(),
  router: appRouter,
  createContext() {
    return {};
  },
}).listen(2022);
