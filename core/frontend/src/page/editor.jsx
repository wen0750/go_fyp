import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";

// import EditorTemplate from "../component/editor_template";
// import EditorTemplateNew from "../component/editor_template2";
import EditorTemplate from "../component/editor_template2";
import EditorAction from "../component/editor_action";
import EditorVariables from "../component/editor_variables";
import EditorWorkflow from "../component/editor_workflow";
import EditorUpload from "../component/editor_upload";
import EditorEdit from "../component/editor_edit";

import Editor_Right from "../component/editor_right";

import globeVar from "../../GlobalVar";

class Editor extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            curTab: 0,
            input: {},
            tableData: null,
            totalWidth: "50%",
            userinput: {},
        };
    }

    setInput = (newData) => {
        this.setState({ input: newData });
    };

    setUserInput = (newData) => {
        console.log(newData);
        newData["id"] = String(Date.now() + 28800000);
        fetch(`${globeVar.backendprotocol}://${globeVar.backendhost}/editor/save`, {
            method: "POST",
            body: JSON.stringify(newData),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else if (response.status === 409) {
                    throw new Error("Duplicate entry");
                } else {
                    console.log("Server responded with an error");
                    throw new Error("Server Error");
                }
            })
            .then((data) => {
                console.log("Action:", data.action);
                console.log("Inserted ID:", data.id);

                let title;
                let htmlContent;
                if (data.action === "created") {
                    title = "Template Created Successfully";
                    htmlContent =
                        "<strong>UID:</strong> " +
                        data.id +
                        "<br>" +
                        "This is the <strong>UID</strong> in the Database, you can save it for later search";
                } else {
                    title = "Template Updated Successfully";
                    htmlContent =
                        "<strong>Template Name:</strong> " +
                        data.id +
                        "<br>" +
                        "It is updated in the Database, you can check it anytime";
                }

                // Show a message box to let the user know the Inserted ID
                Swal.fire({
                    title: title,
                    html: htmlContent,
                    icon: "success",
                });
            })
            .catch((error) => {
                console.error("Error:", error);

                if (error.message === "Duplicate entry") {
                    // Display a failure message box for duplicate entry
                    Swal.fire({
                        title: "ID Duplicated in Database",
                        text: "A template with this ID already exists. Please try again with a different Name.",
                        icon: "error",
                    });
                } else {
                }
            });

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
                {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
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
        let tempTW = "";
        if (newValue === 0 || newValue === 3) {
            tempTW = "50%";
        } else {
            tempTW = "100%";
        }

        if (this.state.totalWidth != tempTW) {
            this.setState({ totalWidth: tempTW });
        }
        this.setState({ curTab: newValue });
    };

    setTableData = (newValue) => {
        this.setState({ tableData: newValue });
    };

    render() {
        const columns = [
            {
                Header: "Name",
                columns: [
                    {
                        Header: "First Name",
                        accessor: "firstName",
                    },
                    {
                        Header: "Last Name",
                        accessor: "lastName",
                    },
                ],
            },
            {
                Header: "Info",
                columns: [
                    {
                        Header: "Age",
                        accessor: "age",
                    },
                    {
                        Header: "Visits",
                        accessor: "visits",
                    },
                    {
                        Header: "Status",
                        accessor: "status",
                    },
                    {
                        Header: "Profile Progress",
                        accessor: "progress",
                    },
                ],
            },
        ];
        return (
            <Box sx={{ width: "100%", display: "flex" }}>
                <Box sx={{ width: this.state.totalWidth }}>
                    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                        <Tabs
                            value={this.state.curTab}
                            onChange={this.handleChange}
                            aria-label="basic tabs example"
                            centered
                        >
                            <Tab label="Template" {...this.a11yProps(0)} />
                            <Tab label="Workflow" {...this.a11yProps(1)} />
                            <Tab label="Upload" {...this.a11yProps(2)} />
                            <Tab label="editor" {...this.a11yProps(3)} />
                        </Tabs>
                    </Box>
                    <this.TabPanel value={this.state.curTab} index={0}>
                        <EditorTemplate onChange={this.setUserInput} templatedata={this.state.input} />
                        <EditorAction input={this.state.input} />
                    </this.TabPanel>
                    <this.TabPanel value={this.state.curTab} index={1}>
                        <EditorWorkflow dataChange={this.setInput} />
                        <EditorAction input={this.state.input} />
                    </this.TabPanel>
                    <this.TabPanel value={this.state.curTab} index={2}>
                        <EditorUpload dataChange={this.setInput} />
                    </this.TabPanel>
                    <this.TabPanel value={this.state.curTab} index={3}>
                        <EditorEdit dataChange={this.setInput} />
                    </this.TabPanel>
                </Box>
                {this.state.curTab == 0 && (
                    <Box sx={{ width: "50%", ml: "0.5rem", height: "100%" }}>
                        <Paper>
                            <Editor_Right></Editor_Right>
                        </Paper>
                    </Box>
                )}
            </Box>
        );
    }
}

export default Editor;
