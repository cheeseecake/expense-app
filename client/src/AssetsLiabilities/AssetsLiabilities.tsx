import {
  Stat,
  StatLabel,
  StatNumber,
  Box,
  Text,
  StatGroup,
  Flex,
  Divider,
  Select,
  useToast,
  SimpleGrid,
} from "@chakra-ui/react";
import { Account } from "./Account";
import { trpc } from "../utils/trpc";
import { AccountType } from "../../../server/types";
import { useCallback, useState } from "react";

export const Accounts = () => {
  const toast = useToast();
  const utils = trpc.useContext();

  const accountList = trpc.getAccounts.useQuery();
  const options = [
    { value: "1", text: "Current Month" },
    { value: "2", text: "Current Year" },
    { value: "3", text: "All" },
  ];

  const [period, setPeriod] = useState<string>(options[0].value);
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
  const onPeriodChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setPeriod(e.target.value),
    []
  );
  return (
    <div>
      <StatGroup>
        <Stat>
          <StatLabel>Total Assets</StatLabel>
          <StatNumber>$3,670</StatNumber>
        </Stat>

        <Stat>
          <StatLabel>Total Liabilities</StatLabel>
          <StatNumber>$945.90</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Investment Ratio</StatLabel>
          <StatNumber>25.7%</StatNumber>
        </Stat>
      </StatGroup>
      <Divider />
      <Flex gap={4}>
        <Box>
          <Select value={period} onChange={onPeriodChange}>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.text}
              </option>
            ))}
          </Select>
          <Text>Donut Chart</Text>
        </Box>
        <Box flex="1">
          <Text>Time Series</Text>
        </Box>
      </Flex>
      <SimpleGrid spacing={4} columns={4}>
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
    </div>
  );
};
