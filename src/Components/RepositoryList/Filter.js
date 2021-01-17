import React from "react";

import { Box, Select, MenuItem } from "@material-ui/core";

export const Filter: React.FC = ({ selected, onChange }) => {
    return (
        <Box ml={4}>
            <Select
                style={{ width: 300 }}
                value={selected}
                onChange={(event) => {
                    onChange(event.target.value);
                }}
                name="language"
            >
                <MenuItem value="js">JavaScript</MenuItem>
                <MenuItem value="java">Java</MenuItem>
                <MenuItem value="dart">Dart</MenuItem>
                <MenuItem value="php">PHP</MenuItem>
                <MenuItem value="rust">Rust</MenuItem>
            </Select>
        </Box>
    );
};
