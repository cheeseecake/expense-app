import { initTRPC } from "@trpc/server";
import { createHTTPServer } from "@trpc/server/adapters/standalone";
import cors from "cors";
import { z } from "zod";
import { ACCOUNT_TYPES, db } from "./db";
import { PrismaClient } from "@prisma/client";

const t = initTRPC.create();
const prisma = new PrismaClient();


export const publicProcedure = t.procedure;
export const router = t.router;

const appRouter = router({
  getAccounts: publicProcedure.query(async () => {
    // Retrieve accounts from a datasource, this is an imaginary database
    const accounts = await prisma.account.findMany();
    //    ^?
    return accounts;
  }),
  getAccountById: publicProcedure.input(z.number()).query(async (opts) => {
    const { input } = opts;
    //      ^?
    // Retrieve the account with the given ID
    const account = await prisma.account.findUnique ({
      where: {
        id: input,
      },
    });
    return account;
  }),
  createAccount: publicProcedure
    .input(z.object({ name: z.string(), type: z.enum(ACCOUNT_TYPES) }))
    .mutation(async (opts) => {
      const { input } = opts;
      //      ^?
      // Create a new account in the database
      const account = await prisma.account.create({
        data: {
          ...input
        }
      });
      //    ^?
      return account;
    })
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
