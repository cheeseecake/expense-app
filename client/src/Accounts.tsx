import { useToast, SimpleGrid } from "@chakra-ui/react";

import { Account } from "./Account";
import { trpc } from "./utils/trpc";
import { AccountType } from "../../server/types";
import { useCallback } from "react";

export const Accounts = () => {
  const toast = useToast();
  const utils = trpc.useContext();

  const accountList = trpc.getAccounts.useQuery();

  const accountRemover = trpc.deleteAccountById.useMutation({
    // Refresh acccounts upon mutation
    onSuccess: () => {
      utils.getAccounts.invalidate();
    },

    // TODO https://chakra-ui.com/docs/components/toast/props
    // Preserve linebreaks in error
    onError: (error) =>
      toast({
        title: "Error",
        position: "top",
        description: error.message,
        status: "error",
        isClosable: true,
        duration: null,
      }),
  });
  const handleDelete = useCallback((id: number) => {
    accountRemover.mutate(id);
  }, []);

  return (
    <SimpleGrid spacing={4} columns={1}>
      {accountList.data?.map(({ name, type, currency, sum, id }) => (
        <Account
          name={name}
          currency={currency}
          type={type as AccountType}
          sum={sum}
          key={id}
          id={id}
          handleDelete={handleDelete}
        />
      ))}
    </SimpleGrid>
  );
};
