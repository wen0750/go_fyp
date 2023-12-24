import * as React from "react";
import styled from "styled-components";

import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";

import { DataGrid } from "@mui/x-data-grid";

import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";

import { TabContext, TabList, TabPanel } from "@mui/lab";

import SendIcon from "@mui/icons-material/Send";

import "../assets/css/editor_top_right.css";
import Dnd_Table from "./dnd_table/Test";
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

        this.FetchDataList = styled.table`
            table {
                border-collapse: collapse;
            }
            table td,
            table th {
                padding: 5px;
                border: 2px solid #000;
            }
            table td:first-child {
                text-align: center;
                width: 18px;
                height: 30px;
            }
            table tr:nth-child(even) td:first-child {
                background-color: #4c8bf5;
                color: #fff;
            }
            table tr:nth-child(odd) td:first-child {
                background-color: #54a08d;
                color: #fff;
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
    FetchDataTable = () => {
        const STable = styled.table`
            border-collapse: collapse;
            width: 100%;
        `;
        const Td = styled.td`
            padding: 5px;
            border: 2px solid #000;

            &:first-child {
                text-align: center;
                width: 18px;
                height: 30px;
            }
            tr:nth-child(even) &:first-child {
                background-color: #4c8bf5;
                color: #fff;
            }
            tr:nth-child(odd) &:first-child {
                background-color: #54a08d;
                color: #fff;
            }
            &:last-child {
                width: 170px;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        `;
        const Th = styled.th`
            padding: 5px;
            border: 2px solid #000;
        `;

        return (
            <STable>
                <thead>
                    <tr>
                        <Th>ID</Th>
                        <Th>Name</Th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <Td>1</Td>
                        <Td>Table cell 2</Td>
                    </tr>
                    <tr>
                        <Td>33</Td>
                        <Td>Table cell 4</Td>
                    </tr>
                    <tr>
                        <Td>33</Td>
                        <Td>
                            Table cell 4 Table cell 4 Table cell 4 Table cell 4
                        </Td>
                    </tr>
                    <tr>
                        <Td>33</Td>
                        <Td>Table cell 4</Td>
                    </tr>
                </tbody>
            </STable>
        );
    };
    FetchedDataList = () => {
        const columns = [
            {
                field: "firstName",
                headerName: "First name",
                width: 150,
            },
            {
                field: "lastName",
                headerName: "Last name",
                width: 150,
            },
        ];

        const rows = [
            { id: 1, lastName: "Snow", firstName: "Jon", age: 14 },
            { id: 2, lastName: "Lannister", firstName: "Cersei", age: 31 },
            { id: 3, lastName: "Lannister", firstName: "Jaime", age: 31 },
            { id: 4, lastName: "Stark", firstName: "Arya", age: 11 },
            { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
            { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
            { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
            { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
            { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
        ];
        return (
            <div>
                <Typography variant="h6" gutterBottom>
                    Heading
                </Typography>
                <Box sx={{ width: "100%" }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 5,
                                },
                            },
                        }}
                        slots={{
                            columnHeaders: () => null,
                        }}
                        hideFooter
                        checkboxSelection
                        disableRowSelectionOnClick
                    />
                </Box>
            </div>
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
                        <TabPanel value="1" sx={{ padding: 0 }}>
                            <this.dnd_TableStyles>
                                {/* <Dnd_Table
                                    columns={this.TableCol}
                                    data={this.state.TableData}
                                    setData={this.ChangeTableData}
                                ></Dnd_Table> */}
                                <h1>s</h1>
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

                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <this.FetchDataTable></this.FetchDataTable>
                    </Grid>
                    <Grid item xs={8}>
                        <this.FetchedDataList></this.FetchedDataList>
                    </Grid>
                </Grid>
            </div>
        );
    }
}
