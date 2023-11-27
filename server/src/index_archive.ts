import { PrismaClient } from "@prisma/client";
import { initTRPC } from "@trpc/server";
import { createHTTPServer } from "@trpc/server/adapters/standalone";
import cors from "cors";
import { z } from "zod";
import { getDbsStatementAsCsv, getDbsStatementSchema } from "./getDbsStatement";
import {
  createCategorySchema,
  createCurrencySchema,
  createAccountSchema,
  createTransactionSchema,
} from "./transaction.schema";

const t = initTRPC.create();

const prisma = new PrismaClient();

export const publicProcedure = t.procedure;
export const router = t.router;

const appRouter = router({
  // Creation
  createCategory: publicProcedure
    .input(createCategorySchema)
    .mutation(async (opts) => {
      const { input } = opts;
      console.log(input);
      // Create a new account in the database
      const currency = await prisma.category.create({
        data: {
          category: input.category,
          typeId: input.typeId,
        },
      });
      return currency;
    }),

  createCurrency: publicProcedure
    .input(createCurrencySchema)
    .mutation(async (opts) => {
      const { input } = opts;
      console.log(input);
      // Create a new account in the database
      const currency = await prisma.currency.create({
        data: {
          currency: input.currency,
        },
      });
      return currency;
    }),

  createAccount: publicProcedure
    .input(createAccountSchema)
    .mutation(async (opts) => {
      const { input } = opts;
      console.log(input);
      const account = await prisma.account.create({
        data: {
          currencyId: input.currencyId,
          categoryId: input.categoryId,
          account: input.account,
        },
      });
      return account;
    }),

  createTransaction: publicProcedure
    .input(createTransactionSchema)
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
  // Deletion & Mutation
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

  // Retrieval
  getAccounts: publicProcedure.query(async () => {
    const groupedResults = await prisma.account.findMany({
      orderBy: [
        {
          categoryId: "asc",
        },
        {
          account: "asc",
        },
      ],
      include: {
        JournalEntry: true,
        category: true,
        currency: true,
      },
    });
    const accounts = groupedResults.map((item) => ({
      id: item.id,
      account: item.account,
      type: item.category.typeId,
      category: item.category.category,
      currency: item.currency.currency,
      sum: item.JournalEntry.reduce((sum, je) => sum + je.amount, 0),
    }));
    return accounts;
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
    return transactions;
  }),
  getJournalEntriesByAccount: publicProcedure
    .input(z.number())
    .query(async (opts) => {
      const { input } = opts;
      // Retrieve the account with the given ID
      const journalEntry = await prisma.journalEntry.findMany({
        where: {
          accountId: input,
        },
      });
      return journalEntry;
    }),

  getTransactionById: publicProcedure.input(z.number()).query(async (opts) => {
    const { input } = opts;
    // Retrieve the account with the given ID
    const transaction = await prisma.transaction.findUnique({
      where: {
        id: input,
      },
    });
    return transaction;
  }),

  getCurrencies: publicProcedure.query(async () => {
    const currencies = await prisma.currency.findMany({});
    return currencies;
  }),
  getCategories: publicProcedure.query(async () => {
    const categories = await prisma.category.findMany({});
    return categories;
  }),
  getTypes: publicProcedure.query(async () => {
    const types = await prisma.type.findMany({});
    return types;
  }),
  getJournalEntries: publicProcedure.query(async () => {
    const journalEntry = await prisma.journalEntry.findMany({});
    return journalEntry;
  }),
  getDbsStatementAsCsv: publicProcedure
    .input(getDbsStatementSchema)
    .mutation(async ({ input }) => await getDbsStatementAsCsv(input)),
  // getAccountsByType: publicProcedure.input(z.string()).query(async (opts) => {
  //   const { input } = opts;
  //   // Retrieve the account with the given ID
  //   const accounts = await prisma.account.findMany({
  //     where: {
  //       type: input,
  //     },
  //   });
  //   return accounts;
  // }),
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
