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
import { AccountType } from "../../../server/types";
import React from "react";

type InputProps = {
  name: string;
  type: AccountType;
  sum: number;
  currency: string;
  id: number;
  handleDelete: (id: number) => void;
};

export const Account = React.memo(
  ({ name, type, currency, sum, id, handleDelete }: InputProps) => {
    return (
      <Card
        maxW="sm"
        variant="elevated"
        style={{
          backgroundColor:
            type === "ASSET"
              ? "#2E4057"
              : type === "EXPENSE"
              ? "#7B435B"
              : type === "INCOME"
              ? "#095256"
              : "#2B303A",
        }}
      >
        <CardBody>
          <Stack spacing="3">
            <Heading size="md">{name} </Heading>
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
            <Button variant="ghost" onClick={() => handleDelete(id)}>
              Delete
            </Button>
          </ButtonGroup>
        </CardFooter>
      </Card>
    );
  }
);
