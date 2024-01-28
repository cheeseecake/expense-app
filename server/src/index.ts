import { PrismaClient } from "@prisma/client";
import { initTRPC } from "@trpc/server";
import { createHTTPServer } from "@trpc/server/adapters/standalone";
import cors from "cors";
import { getDbsStatementAsCsv, getDbsStatementSchema } from "./getDbsStatement";
import {
  paramsInput,
  updateTransactionSchema,
  createTransactionSchema,
} from "./transaction.schema";
import {
  createTransactionController,
  deleteTransactionController,
  findAllTransactionsController,
  findTransactionController,
  updateTransactionController,
} from "./transaction.controller";
import { updateAccountSchema, createAccountSchema } from "./account.schema";
import {
  createAccountController,
  deleteAccountController,
  findAllAccountsController,
  findAccountController,
  updateAccountController,
} from "./account.controller";
import { createCategorySchema, createCurrencySchema } from "./other.schema";
import {
  createCategoryController,
  createCurrencyController,
  findAllCategoriesController,
  findAllCurrenciesController,
} from "./other.controller";

const t = initTRPC.create();

export const prisma = new PrismaClient();

export const publicProcedure = t.procedure;
export const router = t.router;

const appRouter = router({
  getHello: t.procedure.query((req) => {
    return { message: "Welcome to Full-Stack tRPC CRUD App" };
  }),
  getDbsStatementAsCsv: publicProcedure
    .input(getDbsStatementSchema)
    .mutation(async ({ input }) => await getDbsStatementAsCsv(input)),
  createTransaction: t.procedure
    .input(createTransactionSchema)
    .mutation(({ input }) => createTransactionController({ input })),
  updateTransaction: t.procedure
    .input(updateTransactionSchema)
    .mutation(({ input }) =>
      updateTransactionController({
        paramsInput: input.paramsInput,
        input: input.body,
      })
    ),
  deleteTransaction: t.procedure
    .input(paramsInput)
    .mutation(({ input }) =>
      deleteTransactionController({ paramsInput: input })
    ),
  getTransaction: t.procedure
    .input(paramsInput)
    .query(({ input }) => findTransactionController({ paramsInput: input })),
  getTransactions: t.procedure.query(() => findAllTransactionsController()),
  createAccount: t.procedure
    .input(createAccountSchema)
    .mutation(({ input }) => createAccountController({ input })),
  updateAccount: t.procedure.input(updateAccountSchema).mutation(({ input }) =>
    updateAccountController({
      paramsInput: input.paramsInput,
      input: input.body,
    })
  ),
  deleteAccount: t.procedure
    .input(paramsInput)
    .mutation(({ input }) => deleteAccountController({ paramsInput: input })),
  getAccount: t.procedure
    .input(paramsInput)
    .query(({ input }) => findAccountController({ paramsInput: input })),
  getAccounts: t.procedure.query(() => findAllAccountsController()),
  createCategory: t.procedure
    .input(createCategorySchema)
    .mutation(({ input }) => createCategoryController({ input })),
  getCategories: t.procedure.query(() => findAllCategoriesController()),
  createCurrency: t.procedure
    .input(createCurrencySchema)
    .mutation(({ input }) => createCurrencyController({ input })),
  getCurrencies: t.procedure.query(() => findAllCurrenciesController()),
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
