import {
  Button,
  FormControl,
  ModalHeader,
  ModalOverlay,
  Input,
  Select,
  Modal,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  GridItem,
  Grid,
  FormLabel,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";
import { useState } from "react";
import { trpc } from "./utils/trpc";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z
  .object({
    createdAt: z.coerce.date({
      required_error: "Date is required",
      invalid_type_error: "Format invalid",
    }),
    description: z.string({ required_error: "Description is required" }).trim(),
    counterparty: z
      .string({ required_error: "Counterparty is required" })
      .trim(),
    acct_1: z.number().int(),
    amt_1: z.coerce
      .number({ invalid_type_error: "Invalid value" })
      .multipleOf(0.01),
    acct_2: z.number().int(),
    amt_2: z.coerce
      .number({ invalid_type_error: "Invalid value" })
      .multipleOf(0.01),
    // acct_3: z.number().int().nullable(),
    // amt_3: z
    //   .coerce.number({ invalid_type_error: "Invalid value" })
    //   .multipleOf(0.01)
    //   .nullable(),
  })
  .refine((obj) => obj.amt_1 + obj.amt_2 === 0, {
    message: "The sum of all amounts should be 0",
  });

export const AddTransactionButton = () => {
  const accountList = trpc.getAccounts.useQuery();
  const [opened, setOpened] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      createdAt: new Date().toLocaleDateString("fr-CA"),
      description: "Purchased XXX",
      counterparty: "ABC",
      acct_1: 300,
      amt_1: "10",
      acct_2: 320,
      amt_2: "-10",
      acct_3: "",
      amt_3: "",
    },
    // Read up about the options that useForm accepts
  });

  // TODO replace with the real trpc call, and handle/display validation errors accordingly

  /* Libraries for form validation:
    
    - prevent rerendering
    - validation - is the input the correct type?
    - validation - is the input the correct format? e.g. date, number
    - submission - show errors ONLY on the wrong fields
    
    react-hook-form
    
    Homework:
    
    - Read the react-hook-form website
    - Implement validation: string length, sum of values to be zero
        - Use Zod
    - Show error states*/
  const onSubmit = (data) => console.log(data);

  return (
    <>
      <Modal isOpen={opened} onClose={() => setOpened(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Transaction</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form>
              <Grid
                templateRows="repeat(4, 1fr)"
                templateColumns="repeat(5, 1fr)"
                gap={3}
              >
                <GridItem colSpan={2}>
                  <FormControl>
                    <FormLabel>Date</FormLabel>
                    <Input type="date" {...register("createdAt")} />
                    {errors.createdAt?.message && (
                      <p>{errors.createdAt?.message}</p>
                    )}
                  </FormControl>
                </GridItem>
                <GridItem colSpan={3}>
                  <FormControl>
                    <FormLabel>Counterparty</FormLabel>
                    <Input
                      {...register("counterparty")}
                      placeholder="Counterparty"
                    />
                    {errors.counterparty?.message && (
                      <p>{errors.counterparty?.message}</p>
                    )}
                  </FormControl>
                </GridItem>
                <GridItem colSpan={5}>
                  <FormControl>
                    <FormLabel>Description</FormLabel>
                    <Input
                      {...register("description")}
                      placeholder="Purchased ... with ..."
                    />
                    {errors.description?.message && (
                      <p>{errors.description?.message}</p>
                    )}
                  </FormControl>
                </GridItem>

                <GridItem colSpan={3}>
                  <FormControl>
                    <FormLabel>Account</FormLabel>
                    <Select
                      placeholder="Select account"
                      {...register("acct_1")}
                    >
                      {accountList.data?.map(({ name, id }) => (
                        <option value={id}>{name}</option>
                      ))}
                    </Select>
                  </FormControl>
                </GridItem>
                <GridItem colSpan={2}>
                  <FormControl>
                    <FormLabel>Amount</FormLabel>
                    <NumberInput>
                      <NumberInputField {...register("amt_1")} />
                      {errors.amt_1?.message && <p>{errors.amt_1?.message}</p>}
                    </NumberInput>
                  </FormControl>
                </GridItem>
                <GridItem colSpan={3}>
                  <FormControl>
                    <FormLabel>Account</FormLabel>
                    <Select
                      placeholder="Select account"
                      {...register("acct_2")}
                    >
                      {accountList.data?.map(({ name, id }) => (
                        <option value={id}>{name}</option>
                      ))}
                    </Select>
                  </FormControl>
                </GridItem>
                <GridItem colSpan={2}>
                  <FormControl>
                    <FormLabel>Amount</FormLabel>
                    <NumberInput>
                      <NumberInputField {...register("amt_2")} />
                      {errors.amt_2?.message && <p>{errors.amt_2?.message}</p>}
                    </NumberInput>
                  </FormControl>
                </GridItem>
                {/* <GridItem colSpan={3}>
                  <FormControl>
                    <FormLabel>Account</FormLabel>
                    <Select
                      placeholder="Select account"
                      {...register("acct_3")}
                    >
                      {accountList.data?.map(({ name, id }) => (
                        <option value={id}>{name}</option>
                      ))}
                    </Select>
                  </FormControl>
                </GridItem>
                <GridItem colSpan={2}>
                  <FormControl>
                    <FormLabel>Amount</FormLabel>
                    <NumberInput>
                    <NumberInputField {...register("amt_3")} />
                    {errors.amt_3?.message && <p>{errors.amt_3?.message}</p>}
                    </NumberInput>
                  </FormControl>
                </GridItem> */}
              </Grid>
              <Button
                width="full"
                mt={4}
                type="submit"
                onClick={handleSubmit(onSubmit)}
              >
                Add
              </Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Button onClick={() => setOpened(true)}>Add Transaction</Button>
    </>
  );
};
