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
import { AddTransaction } from "./AddTransaction";
import { AddAccount } from "./AddAccount";
import { useState } from "react";

export const Form = () => {
  const [opened, setOpened] = useState(false);
  return (
    <>
      <Modal isOpen={opened} onClose={() => setOpened(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Tabs isFitted variant="soft-rounded">
              <TabList mb="1em">
                <Tab>Transaction</Tab>
                <Tab>Account</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <AddTransaction />
                </TabPanel>
                <TabPanel>
                  <AddAccount />
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
