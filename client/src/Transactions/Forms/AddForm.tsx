import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Button,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { TransactionForm } from "./TransactionForm";
import { AccountForm } from "./AccountForm";
import { CategoryForm } from "./CategoryForm";
import { CurrencyForm } from "./CurrencyForm";
import { trpc } from "../../utils/trpc";
import { createCategorySchema } from "../../../../server/src/other.schema";

export const Form = () => {
  const [opened, setOpened] = useState(false);
   const { data, isSuccess } = trpc.getCategories.useQuery();

  const [categories, setCategories] = useState<
    Array<
      createCategorySchema & {
        id: number;
      }
    >
  >([]);
  useEffect(() => {
    if (!isSuccess) return;
    console.log(data);
    setCategories(data.categories);
  }, [isSuccess]);
  return (
    <>
      <Modal isOpen={opened} onClose={() => setOpened(false)} size="6xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Tabs isFitted variant="soft-rounded">
              <TabList mb="1em">
                <Tab>Transaction</Tab>
                <Tab>Account</Tab>
                <Tab>Category</Tab>
                <Tab>Currency</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <TransactionForm categories={categories} />
                </TabPanel>
                <TabPanel>
                  <AccountForm categories={categories} />{" "}
                </TabPanel>
                <TabPanel>
                  {" "}
                  <CategoryForm />{" "}
                </TabPanel>
                <TabPanel>
                  {" "}
                  <CurrencyForm />{" "}
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Button onClick={() => setOpened(true)}>New</Button>
    </>
  );
};
