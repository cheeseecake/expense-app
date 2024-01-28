import {
  Stat,
  StatLabel,
  StatNumber,
  Box,
  StatGroup,
  Flex,
  Divider,
  Input,
  useToast,
  SimpleGrid,
  Select,
} from "@chakra-ui/react";
import { Account } from "./Account";
import { PieChart, Pie, Tooltip, Label } from "recharts";
import { trpc } from "../utils/trpc";
import { useCallback, useState, useMemo, useEffect } from "react";

export const Accounts = () => {
  const toast = useToast();
  const utils = trpc.useContext();

  const accountTypes = [0, 1, 2, 3, 4];
  const [accountType, setAccountType] = useState<number>();

  const { data, isSuccess } = trpc.getAccounts.useQuery();

  const [filteredAccounts, setFilteredAccounts] = useState<
    Array<{
      account: string;
      type: number;
      category: string;
      currency: string;
      sum: number;
      id: number;
    }>
  >([]);

  const [searchText, setSearchText] = useState<string>();

  const assetAccData = useMemo(() => {
    return data?.accounts.filter((item) => item.type == 1);
  }, [data]);

  const assetCatData = useMemo(() => {
    let result = [];
    assetAccData?.reduce(function (res, value) {
      if (!res[value.category]) {
        res[value.category] = { category: value.category, sum: 0 };
        result.push(res[value.category]);
      }
      res[value.category].sum += value.sum;
      res[value.category].sum = Math.round(res[value.category].sum);
      return res;
    }, {});
    return result;
  }, [assetAccData]);

  const liabAccData = useMemo(() => {
    return data?.accounts.filter((item) => item.type == 2);
  }, [data]);

  const liabCatData = useMemo(() => {
    let result = [];
    liabAccData?.reduce(function (res, value) {
      if (!res[value.category]) {
        res[value.category] = { category: value.category, sum: 0 };
        result.push(res[value.category]);
      }
      res[value.category].sum += value.sum;
      res[value.category].sum = Math.round(Math.abs(res[value.category].sum));
      return res;
    }, {});
    return result;
  }, [liabAccData]);
  const totalAssets = useMemo(() => {
    return data?.accounts.reduce((acc, obj) => {
      if (obj.type === 1) {
        return acc + obj.sum;
      }
      return Math.round(acc);
    }, 0);
  }, [data]);

  const totalLiabilities = useMemo(() => {
    return data?.accounts.reduce((acc, obj) => {
      if (obj.type === 2) {
        return acc + obj.sum;
      }
      return acc;
    }, 0);
  }, [data]);

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

    let filtered = data.accounts;
    if (accountType != undefined) {
      filtered = filtered?.filter((item) => item.type === accountType);
    }
    if (searchText != null) {
      filtered = filtered?.filter(
        (item) =>
          item.account.toLowerCase().search(searchText.toLowerCase()) != -1 ||
          item.account.toLowerCase().search(searchText.toLowerCase()) != -1
      );
    }
    setFilteredAccounts(filtered);
  }, [isSuccess, searchText, accountType]);

  return (
    <div>
      <Flex gap={4} my={4}>
        <Box flex="1">
          <StatGroup>
            <PieChart width={400} height={200}>
              <Pie
                data={assetCatData}
                dataKey="sum"
                nameKey="category"
                cx="50%"
                cy="80%"
                innerRadius={100}
                outerRadius={130}
                fill="#6cd4ff"
                paddingAngle={2}
                startAngle={180}
                endAngle={0}
              >
                <Label
                  value={Math.abs(totalAssets)?.toLocaleString("en-US", {
                    style: "currency",
                    currency: "SGD",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                  position="centerBottom"
                  fontSize="27px"
                />
                <Label value="Assets" position="centerTop" className="label" />
              </Pie>
              <Tooltip />
            </PieChart>
            <PieChart width={400} height={200}>
              <Pie
                data={liabCatData}
                dataKey="sum"
                nameKey="category"
                cx="50%"
                cy="80%"
                innerRadius={100}
                outerRadius={130}
                fill="#d496a7"
                paddingAngle={2}
                startAngle={180}
                endAngle={0}
              >
                <Label
                  value={Math.abs(totalLiabilities)?.toLocaleString("en-US", {
                    style: "currency",
                    currency: "SGD",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                  position="centerBottom"
                  fontSize="27px"
                />
                <Label
                  value="Liabilities"
                  position="centerTop"
                  className="label"
                />
              </Pie>
              <Tooltip />
            </PieChart>
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
        {filteredAccounts.map(
          ({ account, type, currency, category, sum, id }) => (
            <Account
              account={account}
              type={type}
              currency={currency}
              category={category}
              sum={sum}
              key={id}
              id={id}
            />
          )
        )}
      </SimpleGrid>
    </div>
  );
};
