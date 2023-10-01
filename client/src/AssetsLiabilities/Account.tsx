import { Flex, Card, CardBody, Heading, IconButton } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
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
      <Card p={0} size="sm">
        <CardBody>
          <Flex>
            <Heading size="sm">
              [{type[0]}] {name} {currency} {sum.toFixed(2).toLocaleString()}
            </Heading>
            <IconButton
              variant="ghost"
              colorScheme="gray"
              aria-label="Close"
              onClick={() => handleDelete(id)}
              icon={<CloseIcon boxSize={2} />}
            />
          </Flex>
        </CardBody>
      </Card>
    );
  }
);