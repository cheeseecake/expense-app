import { PrismaClient } from "@prisma/client";
import { initTRPC } from "@trpc/server";
import { createHTTPServer } from "@trpc/server/adapters/standalone";
import cors from "cors";
import { z } from "zod";
import { getDbsStatementAsCsv, getDbsStatementSchema } from "./getDbsStatement";
import { transactionSchema, accountSchema } from "./types";

const t = initTRPC.create();

const prisma = new PrismaClient();

export const publicProcedure = t.procedure;
export const router = t.router;

const appRouter = router({
  getAccounts: publicProcedure.query(async () => {
    const groupedResults = await prisma.account.findMany({
      orderBy: [
        {
          type: "asc",
        },
        {
          name: "asc",
        },
      ],
      include: {
        JournalEntry: true,
      },
    });

    const accounts = groupedResults.map((item) => ({
      id: item.id,
      name: item.name,
      type: item.type,
      currency: item.currency,
      sum: item.JournalEntry.reduce((sum, je) => sum + je.amount, 0),
    }));

    return accounts;
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
    console.log(input);
    // Create a new account in the database
    const account = await prisma.account.create({
      data: {
        currency: input.currency,
        type: input.type,
        name: input.name,
      },
    });
    return account;
  }),

  getTransactions: publicProcedure.query(async () => {
    // Retrieve transactions
    const transactions = await prisma.transaction.findMany({
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
      include: {
        JournalEntry: true, // Include the related journal entries
      },
    });
    const accountIds = transactions.flatMap((obj) =>
      obj.JournalEntry.map((nestedObj) => nestedObj.accountId)
    );
    const accounts = await prisma.account.findMany({
      where: {
        id: {
          in: accountIds,
        },
      },
      select: {
        id: true,
        name: true,
        type: true,
      },
    });

    const accountMap = {};
    accounts.forEach((account) => {
      accountMap[account.id] = account.name;
    });
    const accountTypeMap = {};
    accounts.forEach((account) => {
      accountTypeMap[account.id] = account.type;
    });
    // Associate the account name with each transaction
    const transactions_w_account_name = transactions.map((obj) => {
      const updatedListOfObjects = obj.JournalEntry.map((nestedObj) => {
        const name = accountMap[nestedObj.accountId];
        const type = accountTypeMap[nestedObj.accountId];
        return { ...nestedObj, name: name, type: type }; // Add the 'name' key and value
      });

      return { ...obj, JournalEntry: updatedListOfObjects };
    });

    return transactions_w_account_name;
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
          counterparty: input.counterparty,
          JournalEntry: {
            create: input.JournalEntry,
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
