import * as React from "react";
import styled from "styled-components";

import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";

import { TabContext, TabList, TabPanel } from "@mui/lab";

import SendIcon from "@mui/icons-material/Send";

import "../assets/css/editor_top_right.css";
import { Table } from "./dnd_table/Table";
import { html_beautify } from "js-beautify";

export default class Editor_Right extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            httpmethod: "GET",
            responseViwerType: "1",
            requestTabsType: "1",
            TableData: [
                {
                    id: "row-1",
                    key: "cork",
                    value: "wing",
                    status: false,
                },
                { id: "row-2", key: "password", value: "ppppp", status: true },
            ],
        };

        this.TableCol = [
            {
                Header: "",
                accessor: "status",
            },
            {
                Header: "Key",
                accessor: "key",
            },
            {
                Header: "Value",
                accessor: "value",
            },
        ];

        this.dnd_TableStyles = styled.div`
            padding: 1rem;

            table {
                border-spacing: 0;
                border: 1px solid black;

                tr {
                    :last-child {
                        td {
                            border-bottom: 0;
                        }
                    }
                }

                th,
                td {
                    margin: 0;
                    padding: 0.5rem;
                    border-bottom: 1px solid black;
                    border-right: 1px solid black;

                    :last-child {
                        border-right: 0;
                    }
                }
            }
        `;
    }

    // Top Part
    handleRequestMethodChange = (method) => {
        if (method.target.value != this.state.httpmethod) {
            console.log();
            this.setState({
                httpmethod: method.target.value,
            });
        }
    };
    selectRequestMethod = () => {
        return (
            <Select
                sx={{ borderRadius: "4px 0 0 4px", minWidth: 120 }}
                value={this.state.httpmethod}
                onChange={this.handleRequestMethodChange}
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
            >
                <MenuItem value="GET">GET</MenuItem>
                <MenuItem value="POST">POST</MenuItem>
                <MenuItem value="PUT">PUT</MenuItem>
                <MenuItem value="DELETE">DELETE</MenuItem>
            </Select>
        );
    };

    //Bottom Part
    requestFlowLine = () => {
        return (
            <List
                sx={{
                    width: "100%",
                    maxWidth: 360,
                    bgcolor: "background.paper",
                    position: "relative",
                    overflow: "auto",
                    maxHeight: 300,
                    "& ul": { padding: 0 },
                }}
                subheader={<li />}
            >
                {[0, 1, 2, 3, 4].map((sectionId) => (
                    <li key={`section-${sectionId}`}>
                        <ul>
                            <ListSubheader>{`I'm sticky ${sectionId}`}</ListSubheader>
                            {[0, 1, 2].map((item) => (
                                <ListItem key={`item-${sectionId}-${item}`}>
                                    <ListItemText primary={`Item ${item}`} />
                                </ListItem>
                            ))}
                        </ul>
                    </li>
                ))}
            </List>
        );
    };

    // Respone View
    // fatch data
    componentDidMount() {
        // this.fetchData();
    }

    fetchData = async () => {
        try {
            const response = await fetch(
                "https://www.npmjs.com/package/react-syntax-highlighter"
            );
            const jsonData = await response.text();

            this.setState({ tmpdata: jsonData });
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    Right_ResponseViwer_Type_Change = (event, newValue) => {
        this.setState({ responseViwerType: newValue });
    };

    RequestTabsChange = (event, newValue) => {
        this.setState({ requestTabsType: newValue });
    };

    ChangeTableData = (newValue) => {
        this.setState({ TableData: newValue });
    };

    render() {
        console.log(html_beautify(this.state.tmpdata));
        return (
            <div>
                <Box
                    component="section"
                    sx={{
                        p: 2,
                        border: "1px solid grey",
                        backgroundColor: "whitesmoke",
                    }}
                >
                    <Stack
                        direction="row"
                        spacing={0}
                        alignItems="center"
                        justifyContent="center"
                    >
                        <this.selectRequestMethod />
                        <TextField
                            fullWidth
                            label="URL ( https://example.com )"
                            id="fullWidth"
                            sx={{ borderRadius: "0", minWidth: 120 }}
                        />
                        <Button
                            variant="contained"
                            endIcon={<SendIcon />}
                            sx={{ borderRadius: "0 4px 4px 0", height: "56px" }}
                            size="large"
                        >
                            Send
                        </Button>
                    </Stack>
                    <TabContext value={this.state.requestTabsType}>
                        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                            <TabList
                                onChange={this.RequestTabsChange}
                                aria-label="lab API tabs example"
                            >
                                <Tab label="Params" value="1" />
                                <Tab label="Auth" value="2" />
                                <Tab label="Header" value="3" />
                                <Tab label="Body" value="4" />
                            </TabList>
                        </Box>
                        <TabPanel value="1">
                            <this.dnd_TableStyles>
                                <Table
                                    columns={this.TableCol}
                                    data={this.state.TableData}
                                    setData={this.ChangeTableData}
                                ></Table>
                            </this.dnd_TableStyles>
                        </TabPanel>
                        <TabPanel value="2">Item Two</TabPanel>
                        <TabPanel value="3">Item Three</TabPanel>
                        <TabPanel value="4">Item </TabPanel>
                    </TabContext>
                </Box>

                <TabContext value={this.state.responseViwerType}>
                    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                        <TabList
                            onChange={this.Right_ResponseViwer_Type_Change}
                            aria-label="lab API tabs example"
                        >
                            <Tab label="HTML Code" value="1" />
                            <Tab label="Page Review" value="2" />
                        </TabList>
                    </Box>
                    <TabPanel
                        value="1"
                        sx={{
                            padding: 0,
                            height: "50%",
                            maxHeight: "500px",
                            overflow: "scroll",
                        }}
                    >
                        {html_beautify(this.state.tmpdata)}
                    </TabPanel>
                    <TabPanel
                        value="2"
                        sx={{
                            padding: 0,
                            height: "50%",
                            maxHeight: "500px",
                            overflowY: "scroll",
                        }}
                    >
                        <div
                            dangerouslySetInnerHTML={{
                                __html: this.state.tmpdata,
                            }}
                        ></div>
                    </TabPanel>
                </TabContext>
            </div>
        );
    }
}
