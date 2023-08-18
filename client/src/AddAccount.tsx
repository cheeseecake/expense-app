import {
  Button,
  FormControl,
  VStack,
  Input,
  FormLabel,
  useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trpc } from "./utils/trpc";
import { accountSchema } from "./validationSchema";
import { AccountTypeRadios } from "./AccountTypeRadios";
import { AccountType } from "../../server/types";

export const AddAccount = () => {
  const utils = trpc.useContext();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof accountSchema>>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: "",
      type: AccountType.ASSET,
    },
  });

  const accountCreator = trpc.createAccount.useMutation({
    // Refresh acccounts upon mutation
    onSuccess: () => {
      utils.getAccounts.invalidate();
      reset();
      toast({
        title: "Success",
        position: "top",
        description: "Account created!",
        status: "success",
      });
    },

    onError: (error) =>
      toast({
        title: "Error",
        position: "top",
        description: error.message,
        status: "error",
        isClosable: true,
        duration: null,
      }),
  });

  const onSubmit = (data: z.infer<typeof accountSchema>) =>
    accountCreator.mutate(data);

  return (
    <>
      <form>
        <VStack spacing={4} align="stretch">
          <FormControl>
            <FormLabel>Type</FormLabel>
            <AccountTypeRadios control={control} name="type" />
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
            onClick={handleSubmit(onSubmit)}
          >
            Create
          </Button>
        </VStack>
      </form>
    </>
  );
};
