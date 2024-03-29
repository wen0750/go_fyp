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

import { CopyBlock, dracula } from "react-code-blocks";

import SendIcon from "@mui/icons-material/Send";

import "../assets/css/editor_top_right.css";
import Dnd_Table from "./dnd_table/Test";
import { html_beautify } from "js-beautify";
import globeVar from "../../GlobalVar";

const STable = styled.table`
    border-collapse: collapse;
    width: 100%;
`;
const Td = styled.td`
    padding: 5px;
    border: 2px solid #000;

    &:first-child {
        user-select: none;
        text-align: center;
        width: 18px;
        height: 30px;
    }
    tr:nth-child(even) &:first-child {
        background-color: #e8e8e8;
        color: #495464;
    }
    tr:nth-child(odd) &:first-child {
        background-color: #bbbfca;
        color: #495464;
    }
    &:last-child {
        width: 170px;
        max-width: 170px;
        overflow: hidden;
        text-overflow: ellipsis;
    }
`;
const Th = styled.th`
    padding: 5px;
    border: 2px solid #000;
`;

const dnd_TableStyles = styled.div`
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

const FetchDataList = styled.table`
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

export default class Editor_Right extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            reqHttpMethod: "GET",
            reqURL: "",
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
            fetchDataActiveID: null,
            tmpdata: false,
            yrow1: [],
            yrow2: [],
            yrow3: [],
            ycolumns: [
                {
                    field: "key",
                    headerName: "First name",
                    width: 150,
                },
                {
                    field: "value",
                    headerName: "Last name",
                    width: 300,
                },
            ],
        };
    }

    // Top Part
    handleRequestMethodChange = (method) => {
        if (method.target.value != this.state.reqHttpMethod) {
            console.log();
            this.setState({
                reqHttpMethod: method.target.value,
            });
        }
    };
    handleURLChange = (event) => {
        this.setState({
            reqURL: event.target.value,
        });
    };
    selectRequestMethod = () => {
        return (
            <Select
                sx={{ borderRadius: "4px 0 0 4px", minWidth: 120 }}
                value={this.state.reqHttpMethod}
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
    FetchDataTableClickHandler = (newID) => {
        let data = this.state.tmpResourceList[newID];

        // General
        const fmdataGeneral = [
            {
                id: 1,
                key: "Request URL",
                value: data.url,
            },
            {
                id: 2,
                key: "Request Method",
                value: data.method,
            },
            {
                id: 3,
                key: "Status Code",
                value: data.status,
            },
            {
                id: 4,
                key: "Remote Address",
                value: data.remoteIPAddress,
            },
            {
                id: 5,
                key: "Remote Port",
                value: data.remotePort,
            },
            { id: 6, key: "Referrer Policy", value: data.referrerPolicy },
            {
                id: 7,
                key: "Encoded Data Length",
                value: data.encodedDataLength,
            },
        ];

        // Response Headers
        const fmdataReqHeader = [];
        Object.keys(data.reqheaders).forEach((element, index) => {
            console.log(element, index);
            fmdataReqHeader.push({
                id: index,
                key: element,
                value: data.reqheaders[element],
            });
        });

        // Request Headers
        const fmdataRespHeader = [];
        Object.keys(data.respheaders).forEach((element, index) => {
            console.log(element, index);
            fmdataRespHeader.push({
                id: index,
                key: element,
                value: data.respheaders[element],
            });
        });

        this.setState({
            yrow1: fmdataGeneral,
            yrow2: fmdataReqHeader,
            yrow3: fmdataRespHeader,
        });
    };
    FetchDataTable = ({ changeSelectData }) => {
        return (
            <STable>
                <thead>
                    <tr>
                        <Th>ID</Th>
                        <Th>Name</Th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.tmpdata &&
                        this.state.tmpResourceList.map((cell, j) => (
                            <tr>
                                <Td>{j + 1}</Td>
                                <Td onClick={() => changeSelectData(j)}>
                                    {cell.url.split("/").at(-1) != ""
                                        ? cell.url
                                              .split("/")
                                              .at(-1)
                                              .split("?")
                                              .at(0)
                                        : cell.url
                                              .split("/")
                                              .at(-2)
                                              .split("?")
                                              .at(0)}
                                </Td>
                            </tr>
                        ))}
                </tbody>
            </STable>
        );
    };
    FetchedDataList = ({ headerName, columns, rows }) => {
        return (
            <div>
                <Typography variant="h6" gutterBottom>
                    {headerName}
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
                `${globeVar.backendprotocol}://${globeVar.backendhost}/pageresponse/capture`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        url: this.state.reqURL,
                    }),
                }
            );
            const jsonData = await response.json();

            this.setState({
                tmpHTMLBody: jsonData.body,
                tmpResourceList: jsonData.result,
                tmpdata: true,
            });
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
        // console.log(html_beautify(this.state.tmpHTMLBody));
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
                            sx={{ borderRadius: "0", minWidth: 120 }}
                            onChange={this.handleURLChange}
                        />
                        <Button
                            variant="contained"
                            endIcon={<SendIcon />}
                            sx={{ borderRadius: "0 4px 4px 0", height: "56px" }}
                            size="large"
                            onClick={this.fetchData}
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
                            <dnd_TableStyles>
                                {/* <Dnd_Table
                                    columns={this.TableCol}
                                    data={this.state.TableData}
                                    setData={this.ChangeTableData}
                                ></Dnd_Table> */}
                                <h1>s</h1>
                            </dnd_TableStyles>
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
                            {/* <Tab label="Page Review" value="2" /> */}
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
                        {/* {html_beautify(this.state.tmpHTMLBody)} */}
                        <CopyBlock
                            language="html"
                            text={html_beautify(this.state.tmpHTMLBody)}
                            codeBlock
                            theme={dracula}
                            showLineNumbers={false}
                        />
                    </TabPanel>
                    {/* <TabPanel
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
                                __html: this.state.tmpHTMLBody,
                            }}
                        ></div>
                    </TabPanel> */}
                </TabContext>
                <Grid container spacing={2} sx={{ paddingRight: "5px" }}>
                    <Grid item xs={4}>
                        <this.FetchDataTable
                            changeSelectData={this.FetchDataTableClickHandler}
                        ></this.FetchDataTable>
                    </Grid>
                    <Grid item xs={8}>
                        <this.FetchedDataList
                            headerName={"General"}
                            columns={this.state.ycolumns}
                            rows={this.state.yrow1}
                        ></this.FetchedDataList>
                        <this.FetchedDataList
                            headerName={"Response Headers"}
                            columns={this.state.ycolumns}
                            rows={this.state.yrow2}
                        ></this.FetchedDataList>
                        <this.FetchedDataList
                            headerName={"Request Headers"}
                            columns={this.state.ycolumns}
                            rows={this.state.yrow3}
                        ></this.FetchedDataList>
                    </Grid>
                </Grid>
            </div>
        );
    }
}
