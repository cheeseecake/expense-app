import { initTRPC } from "@trpc/server";
import { createHTTPServer } from "@trpc/server/adapters/standalone";
import cors from "cors";
import { z } from "zod";
import { ACCOUNT_TYPES, db } from "./db";

const t = initTRPC.create();

export const publicProcedure = t.procedure;
export const router = t.router;

const appRouter = router({
  accountList: publicProcedure.query(async () => {
    // Retrieve accounts from a datasource, this is an imaginary database
    const accounts = await db.account.findMany();
    //    ^?
    return accounts;
  }),
  accountById: publicProcedure.input(z.number()).query(async (opts) => {
    const { input } = opts;
    //      ^?
    // Retrieve the account with the given ID
    const account = await db.account.findById(input);
    return account;
  }),
  accountCreate: publicProcedure
    .input(z.object({ name: z.string(), type: z.enum(ACCOUNT_TYPES) }))
    .mutation(async (opts) => {
      const { input } = opts;
      //      ^?
      // Create a new account in the database
      const account = await db.account.create(input);
      //    ^?
      return account;
    }),
});

/* Export only the type */
export type AppRouter = typeof appRouter;

// create server
createHTTPServer({
  middleware: cors(),
  router: appRouter,
  createContext() {
    console.log("context 3");
    return {};
  },
}).listen(2022);
