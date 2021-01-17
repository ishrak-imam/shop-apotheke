import React from "react";

import { Box } from "@material-ui/core";
import { RepositoryList } from "./Components/RepositoryList";

const App: React.FC = () => {
    return (
        <Box my={4} display="flex" justifyContent="center">
            <RepositoryList />
        </Box>
    );
};

export default App;
