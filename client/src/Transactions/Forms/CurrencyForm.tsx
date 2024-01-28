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
import { trpc } from "../../utils/trpc";
import { createCurrencySchema } from "../../../../server/src/other.schema";

export const CurrencyForm = () => {
  const utils = trpc.useContext();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof createCurrencySchema>>({
    resolver: zodResolver(createCurrencySchema),
    defaultValues: {
      currency: "",
    },
  });

  const currencyCreator = trpc.createCurrency.useMutation({
    // Refresh acccounts upon mutation
    onSuccess: () => {
      utils.getCurrencies.invalidate();
      reset();
      toast({
        title: "Success",
        position: "top",
        description: "Currency created!",
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

  const onSubmit = (data: z.infer<typeof createCurrencySchema>) =>
    currencyCreator.mutate(data);

  return (
    <>
      <form>
        <VStack spacing={4} align="stretch">
          <FormControl>
            <FormLabel>Currency</FormLabel>
            <Input {...register("currency")} />
            {errors.currency?.message && <p>{errors.currency?.message}</p>}
          </FormControl>
          <Button
            width="full"
            mt={4}
            type="submit"
            onClick={handleSubmit(onSubmit)}
          >
            Save
          </Button>
        </VStack>
      </form>
    </>
  );
};
