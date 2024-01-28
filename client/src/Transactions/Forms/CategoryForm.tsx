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
import { AccountTypeRadios } from "./TypeRadio";
import { createCategorySchema } from "../../../../server/src/other.schema";

export const CategoryForm = () => {
  const utils = trpc.useContext();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof createCategorySchema>>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      category: "",
      typeId: "1",
    },
  });

  const categoryCreator = trpc.createCategory.useMutation({
    // Refresh acccounts upon mutation
    onSuccess: () => {
      utils.getCategories.invalidate();
      reset();
      toast({
        title: "Success",
        position: "top",
        description: "Category created!",
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

  const onSubmit = (data: z.infer<typeof createCategorySchema>) =>
    console.log(data);
  //  categoryCreator.mutate(data);

  return (
    <>
      <form>
        <VStack spacing={4} align="stretch">
          <FormControl>
            <FormLabel>Type</FormLabel>
            <AccountTypeRadios control={control} name="typeId" />
          </FormControl>
          <FormControl>
            <FormLabel>Category</FormLabel>
            <Input {...register("category")} />
            {errors.category?.message && <p>{errors.category?.message}</p>}
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
