
import React from "react";

import { z } from "zod";
import { transactionSchema } from "../../../server/types";

type InputProps = {
  filteredTransactions: Array<
    Omit<z.infer<typeof transactionSchema>, "createdAt"> & {
      createdAt: string;
      journalEntries: Array<{
        accountId: number;
        amount: number;
        name: string;
        type: number;
      }>;
    }
  >;
};

export const BalanceSheetOverview = React.memo(
  React.forwardRef<HTMLDivElement, InputProps>(
    ({ filteredTransactions }: InputProps) => {
      return (
        <>
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
        </>
      );
    }
  )
);
