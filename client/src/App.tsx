import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { Transactions } from "./Transactions";
import { Accounts } from "./Accounts";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { trpc } from "./utils/trpc";

export const App = () => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "http://localhost:2022",
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Tabs isFitted variant="soft-rounded">
          <TabList mb="1em">
            <Tab>Accounts</Tab>
            <Tab>Transactions</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Accounts />
            </TabPanel>
            <TabPanel>
              <Transactions />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </QueryClientProvider>
    </trpc.Provider>
  );
};
