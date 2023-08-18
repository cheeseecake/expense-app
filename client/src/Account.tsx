import {
  Flex,
  Card,
  CardBody,
  Heading,
  Text,
  IconButton,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { AccountType } from "../../server/types";
import React from "react";

type InputProps = {
  name: string;
  type: AccountType;
  id: number;
  handleDelete: (id: number) => void;
};

export const Account = React.memo(
  ({ name, type, id, handleDelete }: InputProps) => {
    return (
      <Card p={0}>
        <CardBody>
          <Heading size="sm">{name}</Heading>
          <Text>{type}</Text>
          <Flex>
            <IconButton
              variant="ghost"
              colorScheme="gray"
              aria-label="Close"
              onClick={() => handleDelete(id)}
              icon={<CloseIcon boxSize={4} />}
            />
          </Flex>
        </CardBody>
      </Card>
    );
  }
);
