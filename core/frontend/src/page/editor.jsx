import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import EditorTemplate from "../component/editor_template";
import EditorAction from "../component/editor_action";
import EditorVariables from "../component/editor_variables";
import EditorWorkflow from "../component/editor_workflow";
import EditorUpload from "../component/editor_upload";
import EditorEdit from "../component/editor_edit";

class Editor extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            curTab: 0,
            input: {},
        };
    }

    setInput = (newData) => {
        this.setState({ input: newData });
    };

    TabPanel = (props) => {
        const { children, value, index, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box sx={{ p: 3 }}>
                        <Typography>{children}</Typography>
                    </Box>
                )}
            </div>
        );
    };

    a11yProps = (index) => {
        return {
            id: `simple-tab-${index}`,
            "aria-controls": `simple-tabpanel-${index}`,
        };
    };

    handleChange = (event, newValue) => {
        this.setState({ curTab: newValue });
    };

    render() {
        return (
            <Box sx={{ width: "100%" }}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <Tabs
                        value={this.state.curTab}
                        onChange={this.handleChange}
                        aria-label="basic tabs example"
                        centered
                    >
                        <Tab label="Template" {...this.a11yProps(0)} />
                        <Tab label="Workflow" {...this.a11yProps(1)} />
                        <Tab label="Variable" {...this.a11yProps(2)} />
                        <Tab label="Upload" {...this.a11yProps(3)} />
                        <Tab label="editor" {...this.a11yProps(4)} />
                    </Tabs>
                </Box>
                <this.TabPanel value={this.state.curTab} index={0}>
                    <EditorTemplate dataChange={this.setInput} />
                    
                </this.TabPanel>
                <this.TabPanel value={this.state.curTab} index={1}>
                    <EditorWorkflow dataChange={this.setInput} />
                    <EditorAction input={this.state.input} />
                </this.TabPanel>
                <this.TabPanel value={this.state.curTab} index={2}>
                    <EditorVariables dataChange={this.setInput} />
                    <EditorAction input={this.state.input} />
                </this.TabPanel>
                <this.TabPanel value={this.state.curTab} index={3}>
                    <EditorUpload dataChange={this.setInput} />
                </this.TabPanel>
                <this.TabPanel value={this.state.curTab} index={4}>
                    <EditorEdit dataChange={this.setInput} />
                </this.TabPanel>
            </Box>
        );
    }
}

export default Editor;
