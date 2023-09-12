import * as React from "react";
import { Box } from "@mui/material";
import { FolderHeader } from "../component/page_style/folder_style";

import Terminal from "../component/terminal/Terminal";
import "../assets/css/project_style.css";

class TerminalBody extends React.Component {
    constructor(props) {
        super(props);
        this.state = { open: false };
    }

    render() {
        return (
            <Box sx={{ width: "100%" }}>
                <Box
                    sx={{
                        width: "100%",
                        borderBottom: 1,
                        borderColor: "divider",
                        py: 2,
                        px: 3,
                    }}
                >
                    <FolderHeader>
                        <h1>Terminal</h1>
                    </FolderHeader>
                </Box>
                <Box
                    sx={{
                        width: "100%",
                        py: 2,
                        px: 3,
                    }}
                >
                    <Terminal></Terminal>
                </Box>
            </Box>
        );
    }
}

export default TerminalBody;
