import {
  Stat,
  StatLabel,
  StatNumber,
  Box,
  Text,
  StatGroup,
  Flex,
  Divider,
  Input,
  useToast,
  SimpleGrid,
  Select,
} from "@chakra-ui/react";
import { Account } from "./Account";
import { trpc } from "../utils/trpc";
import { AccountType } from "../../../server/types";
import { useCallback, useState, useMemo, useEffect } from "react";

export const Accounts = () => {
  const toast = useToast();
  const utils = trpc.useContext();

  const accountTypes = ["ALL", "ASSET", "LIABILITY", "INCOME", "EXPENSE"];
  const [accountType, setAccountType] = useState<string>();

  const { data, isSuccess } = trpc.getAccounts.useQuery();

  const [filteredAccounts, setFilteredAccounts] = useState<
    Array<{
      accountId: number;
      amount: number;
      name: string;
      type: AccountType;
    }>
  >([]);

  const [searchText, setSearchText] = useState<string>();

  const totalAssets = useMemo(() => {
    return data?.reduce((acc, obj) => {
      if (obj.type === "ASSET") {
        return acc + obj.sum;
      }
      return acc;
    }, 0);
  }, [data]);

  const totalLiabilities = useMemo(() => {
    return data?.reduce((acc, obj) => {
      if (obj.type === "LIABILITY") {
        return acc + obj.sum;
      }
      return acc;
    }, 0);
  }, [data]);

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

  const onSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.target.value),
    []
  );
  const onAccountTypeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (e.target.value != "ALL") {
        setAccountType(e.target.value);
      } else {
        setAccountType(undefined);
      }
    },
    [setAccountType]
  );
  useEffect(() => {
    if (!isSuccess) return;

    let filtered = data;
    if (accountType != undefined) {
      filtered = filtered?.filter((item) => item.type === accountType);
    }
    if (searchText != null) {
      filtered = filtered?.filter(
        (item) =>
          item.name.toLowerCase().search(searchText.toLowerCase()) != -1 ||
          item.name.toLowerCase().search(searchText.toLowerCase()) != -1
      );
    }
    setFilteredAccounts(filtered);
  }, [isSuccess, searchText, accountType]);

  return (
    <div>
      <Flex gap={4} my={4}>
        <Box flex="1">
          <StatGroup>
            <Stat>
              <StatLabel>Total Assets</StatLabel>
              <StatNumber>
                {Math.abs(totalAssets)?.toLocaleString("en-US", {
                  style: "currency",
                  currency: "SGD",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
                <Text>Donut Chart</Text>
              </StatNumber>
            </Stat>

            <Stat>
              <StatLabel>Total Liabilities</StatLabel>
              <StatNumber>
                {Math.abs(totalLiabilities)?.toLocaleString("en-US", {
                  style: "currency",
                  currency: "SGD",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
                <Text>Donut Chart</Text>
              </StatNumber>
            </Stat>
            <Stat>
              <StatLabel>Asset to Liability Ratio</StatLabel>
              <StatNumber>
                {Math.abs(totalAssets / totalLiabilities)?.toLocaleString(
                  "en-US",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}
              </StatNumber>
            </Stat>
          </StatGroup>
          <Divider />
        </Box>
      </Flex>
      <Flex gap={4}>
        <Select value={accountType} onChange={onAccountTypeChange}>
          {accountTypes.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
        <Input
          value={searchText}
          onChange={onSearchChange}
          placeholder="Search..."
          size="sm"
        />
      </Flex>
      <SimpleGrid spacing={4} columns={3} my={4}>
        {filteredAccounts.map(({ name, type, currency, sum, id }) => (
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
