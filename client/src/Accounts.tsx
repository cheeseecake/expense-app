import { Container, SimpleGrid } from "@chakra-ui/react";

import { Account } from "./Account";
import { trpc } from "./utils/trpc";
import { AccountType } from "../../server/types";
import { useCallback } from "react";

export const Accounts = () => {
  const utils = trpc.useContext();

  const accountList = trpc.getAccounts.useQuery();

  const accountRemover = trpc.deleteAccountById.useMutation({
    // Refresh acccounts upon mutation
    onSuccess: () => {
      utils.getAccounts.invalidate();
    },
  });

  const handleDelete = useCallback((id: number) => {
    accountRemover.mutate(id);
  }, []);

  return (
    <SimpleGrid spacing={4} columns={1}>
      {accountList.data?.map(({ name, type, id }) => (
        <Account
          name={name}
          type={type as AccountType}
          key={id}
          id={id}
          handleDelete={handleDelete}
        />
      ))}
    </SimpleGrid>
  );
};
