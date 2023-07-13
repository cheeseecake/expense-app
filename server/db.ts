type Account = { id: number; name: string; type: "ASSET"|"LIABILTY"|"INCOME"|"EXPENSE"};

// Imaginary database
const accounts: Account[] = [{ id: 1,name: "Food", type: "EXPENSE"}];
export const db = {
  account: {
    findMany: async () => accounts,
    findById: async (id: number) => accounts.find((account) => account.id === id),
    create: async (data: { name: string, type: "ASSET"|"LIABILTY"|"INCOME"|"EXPENSE" }) => {
      const account = { id: accounts.length + 1, ...data };
      accounts.push(account);
      return account;
    },
  },
};
