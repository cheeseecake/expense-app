/**
 * This file is the source of truth - you do not need to repeat this
 * typing anywhere else in the app.
 */

export const ACCOUNT_TYPES = [
  "ASSET",
  "LIABILTY",
  "INCOME",
  "EXPENSE",
] as const;

/* This is known as an 'Indexed Access Type.
https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html */
export type AccountType = (typeof ACCOUNT_TYPES)[number];

export type Account = {
  id: number;
  name: string;
  type: AccountType;
};

// Imaginary database
const accounts: Account[] = [{ id: 1, name: "Food", type: "EXPENSE" }];
export const db = {
  account: {
    findMany: async () => accounts,
    findById: async (id: number) =>
      accounts.find((account) => account.id === id),
    create: async (data: Omit<Account, "id">) => {
      //We remove 'id' from Account
      const account = { id: accounts.length + 1, ...data };
      accounts.push(account);
      return account;
    },
  },
};
