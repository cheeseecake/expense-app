import { Button, FormControl, VStack, Input, FormLabel } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trpc } from "./utils/trpc";
import { accountSchema } from "./validationSchema";
import { AccountTypeRadios } from "./AccountTypeRadios";

export const AddAccount = () => {
  const utils = trpc.useContext();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: "",
      type: "ASSET",
    },
  });

  const accountCreator = trpc.createAccount.useMutation({
    // Refresh acccounts upon mutation
    onSuccess: () => {
      utils.getAccounts.invalidate();
    },
  });
  const onInvalid = (errors) => console.error(errors);
  const onSubmit = (data: z.infer<typeof accountSchema>) =>
    accountCreator.mutate(data);

  return (
    <>
      <form>
        <VStack spacing={4} align="stretch">
          <FormControl>
            <FormLabel>Type</FormLabel>
            <AccountTypeRadios name="type" control={control} />
          </FormControl>
          <FormControl>
            <FormLabel>Account Name</FormLabel>
            <Input {...register("name")} />
            {errors.name?.message && <p>{errors.name?.message}</p>}
          </FormControl>
          <Button
            width="full"
            mt={4}
            type="submit"
            onClick={handleSubmit(onSubmit, onInvalid)}
          >
            Create
          </Button>
        </VStack>
      </form>
    </>
  );
};
