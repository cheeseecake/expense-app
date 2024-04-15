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
import { trpc } from "../../utils/trpc";

export const UploadTransactionsForm = () => {
  const uploadTransaction = trpc.uploadTransactionJSON.useMutation();
  const [opened, setOpened] = useState(false);
  const {
    handleSubmit,
    register,
    formState: { isSubmitting },
  } = useForm();

  const onSubmit = async (file) => {
    try {
      const fileReader = new FileReader();
      fileReader.readAsText(file.file[0], "UTF-8");
      fileReader.onload = e => {
        const jsonString = e.target.result;
        const jsonData = JSON.parse(jsonString);
        console.log(jsonData)
        // Pass the JSON data to uploadTransaction.mutate
        uploadTransaction.mutate(jsonData);
      };

    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };
  
  useEffect(
    () =>
      void (
        uploadTransaction.error &&
        alert(uploadTransaction.error?.message)
      ),
    [uploadTransaction.error]
  );

  return (
    <>
      <Modal isOpen={opened} onClose={() => setOpened(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upload Transactions JSON</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl>
                <input type="file" {...register("file")} />
              </FormControl>
              <Button
                mt={4}
                colorScheme="teal"
                isLoading={isSubmitting || uploadTransaction.isLoading}
                type="submit"
              >
                Upload
                {uploadTransaction.isLoading ? "(uploading...)" : ""}
              </Button>
            </form>

          </ModalBody>
        </ModalContent>
      </Modal>
      <Button onClick={() => setOpened(true)}>Upload JSON File</Button>
    </>
  );
};
