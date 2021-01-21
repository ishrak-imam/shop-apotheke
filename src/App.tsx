import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";

import { Box } from "@material-ui/core";
import { RepositoryList } from "./Components/RepositoryList";

const queryClient = new QueryClient();

const App: React.FC = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <Box my={4} display="flex" justifyContent="center">
                <RepositoryList />
            </Box>
        </QueryClientProvider>
    );
};

export default App;
