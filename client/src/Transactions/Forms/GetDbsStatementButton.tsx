import {
  Button,
  Code,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { IgetDbsStatementSchema } from "../../../server/getDbsStatement";
import { trpc } from "../../utils/trpc";

export const GetDbsStatementButton = () => {
  const getDbsStatement = trpc.getDbsStatementAsCsv.useMutation();
  const [opened, setOpened] = useState(false);
  const {
    handleSubmit,
    register,
    formState: { isSubmitting },
  } = useForm<IgetDbsStatementSchema>();

  const onSubmit = (values: IgetDbsStatementSchema) =>
    getDbsStatement.mutate(values);

  useEffect(
    () => void (getDbsStatement.error && alert(getDbsStatement.error?.message)),
    [getDbsStatement.error]
  );

  return (
    <>
      <Modal isOpen={opened} onClose={() => setOpened(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Download DBS Statement</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl>
                <FormLabel>Username</FormLabel>
                <Input {...register("username")} />
              </FormControl>
              <FormControl>
                <FormLabel>Password</FormLabel>
                <Input {...register("password")} />
              </FormControl>
              <FormControl>
                <FormLabel>Account number with dashes</FormLabel>
                <Input {...register("accountNumberWithDashes")} />
              </FormControl>
              <Button
                mt={4}
                colorScheme="teal"
                isLoading={isSubmitting || getDbsStatement.isLoading}
                type="submit"
              >
                Download{" "}
                {getDbsStatement.isLoading ? "(see console for progress)" : ""}
              </Button>
            </form>
            <Heading>Statement: </Heading>
            <Code>{getDbsStatement.data || "No data"}</Code>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Button onClick={() => setOpened(true)}>Get DBS Statement</Button>
    </>
  );
};
