import {
  Text,
  Card,
  CardBody,
  Heading,
  Stack,
  ButtonGroup,
  CardFooter,
  Button,
  Divider,
} from "@chakra-ui/react";
import React from "react";

type InputProps = {
  account: string;
  type: number;
  currency: string;
  category: string;
  sum: number;
  id: number;
};

export const Account = React.memo(
  ({ account, type, category, currency, sum, id }: InputProps) => {
    return (
      <Card
        maxW="sm"
        variant="elevated"
        style={{
          backgroundColor:
            type === 1
              ? "#2E4057"
              : type === 4
              ? "#7B435B"
              : type === 3
              ? "#095256"
              : "#2B303A",
        }}
      >
        <CardBody>
          <Stack spacing="3">
            <Heading size="md">{account} ({category})</Heading>
            <Text fontSize="xl">
              {currency}{" "}
              {sum.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
          </Stack>
        </CardBody>
        <Divider />
        <CardFooter>
          <ButtonGroup spacing="2">
            <Button variant="solid">Breakdown</Button>
          </ButtonGroup>
        </CardFooter>
      </Card>
    );
  }
);
