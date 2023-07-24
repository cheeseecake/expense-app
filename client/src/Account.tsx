import { Button, Card, CardBody, Heading, Text } from "@chakra-ui/react";
import { AccountType } from "../../server/types";
import React from "react";

type InputProps = {
name: string,
type: AccountType,
id: number,
handleDelete: (id: number) => void
}

export const Account = React.memo(({name, type, id, handleDelete}: InputProps) => {
  return <Card>
    <CardBody>
      <Heading size="md">{type}</Heading>
      <Text>
        {id}. {name}
      </Text>
      <Button
        width="full"
        mt={4}
        type="submit"
        onClick={() => handleDelete(id)}
      >
        X
      </Button>
    </CardBody>
  </Card>;
});
