import * as React from "react";
import ReactDOM from "react-dom";
import { Box, Button, Typography, Divider } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import Table from "@mui/joy/Table";

import { CodeBlock, dracula } from "react-code-blocks";
import { html_beautify } from "js-beautify";

import { UnderLineMiniTitle } from "../component/page_style/project_style";
import ScanDurations from "./project_ext_scan_durations";
import "../assets/css/threats.css";

class ProjectVulnerabilities extends React.Component {
    constructor(props) {
        super(props);
        this.state = { rows: [], openDetails: false, threatDetails: [] };
        this.columns = [
            {
                field: "Serverity",
                flex: 1.5,
                width: 150,
                headerClassName: "gray-background",
                align: "center",
                headerAlign: "center",
                valueGetter: (params) => {
                    if (params.value != null) {
                        if (params.value == 1) {
                            return "Info";
                        } else if (params.value == 2) {
                            return "Low";
                        } else if (params.value == 3) {
                            return "Medium";
                        } else if (params.value == 4) {
                            return "High";
                        } else if (params.value == 5) {
                            return "Critical";
                        }
                    }
                },
            },
            {
                field: "Score",
                flex: 0.8,
                width: 100,
                headerClassName: "gray-background",
                align: "center",
                headerAlign: "center",
            },
            {
                field: "Name",
                flex: 4,
                width: 500,
                headerClassName: "gray-background",
            },
            {
                field: "Family",
                flex: 2,
                width: 200,
                headerClassName: "gray-background",
            },
            {
                field: "Count",
                flex: 1,
                width: 150,
                headerClassName: "gray-background",
            },
        ];
    }

    closeDetails = () => {
        this.setState({ openDetails: false });
    };

    threatslistRowSelect = (params, event, details) => {
        const list = [];

        this.props.inputData.result.forEach((element) => {
            if (element.info.name == params.row.Name) {
                list.push(element);
            }
        });
        this.setState({
            openDetails: true,
            threatDetails: list,
            popupList: Array.apply(null, { length: list.length }).map(function (
                x
            ) {
                return false;
            }),
        });
    };
    threatslist = () => {
        return (
            <div style={{ height: "100%", width: "100%" }}>
                <DataGrid
                    rows={this.state.rows}
                    columns={this.columns}
                    getCellClassName={(params) => {
                        if (
                            params.field !== "Serverity" ||
                            params.value == null
                        ) {
                            return "";
                        } else if (params.value == "Info") {
                            return "Info";
                        } else if (params.value == "Low") {
                            return "Low";
                        } else if (params.value == "Medium") {
                            return "Medium";
                        } else if (params.value == "High") {
                            return "High";
                        } else if (params.value == "Critical") {
                            return "Critical";
                        }
                        return "";
                    }}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 10 },
                        },
                    }}
                    checkboxSelection={false}
                    onRowClick={this.threatslistRowSelect}
                    pageSizeOptions={[5, 10, 15]}
                />
            </div>
        );
    };

    genVulnerabilitiesDetails = () => {
        console.log(this.state.popupList);
        const newpop = [];
        return (
            this.state.threatDetails.length > 0 && (
                <Dialog
                    fullWidth={true}
                    maxWidth={"xl"}
                    open={this.state.openDetails}
                    onClose={this.closeDetails}
                >
                    <DialogTitle
                        sx={{
                            margin: 0,
                            fontWeight: 400,
                            fontSize: "1.5rem",
                            lineHeight: 1.334,
                            letterSpacing: "0em",
                            color: "initial",
                        }}
                    >
                        {this.state.threatDetails[0].info.name}
                    </DialogTitle>
                    <Divider />
                    <DialogContent>
                        <Box sx={{ mb: 5 }}>
                            <Typography
                                variant="h6"
                                gutterBottom
                                sx={{ fontWeight: "bold" }}
                            >
                                Description
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                {this.state.threatDetails[0].info.description}
                            </Typography>
                        </Box>

                        <Box sx={{ mb: 5 }}>
                            <Typography
                                variant="h6"
                                gutterBottom
                                sx={{ fontWeight: "bold" }}
                            >
                                Solution
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                {this.state.threatDetails[0].info.remediation}
                            </Typography>
                        </Box>

                        <Box>
                            <Typography
                                variant="h6"
                                gutterBottom
                                sx={{ fontWeight: "bold" }}
                            >
                                Output
                            </Typography>

                            {this.state.threatDetails.map((answer, i) => {
                                var period =
                                    answer.response.lastIndexOf("\r\n");
                                var headerpart = answer.response.substring(
                                    0,
                                    period
                                );
                                // var htmlpart = answer.response.substring(
                                //     period + 1
                                // );
                                let curnum = i + 1;

                                var subtitle = answer.host;
                                var extention = "";
                                if (answer.request && answer.type == "http") {
                                    var tmpcal = answer.request
                                        .split("\r\n")[0]
                                        .split(" ")[1];
                                    if (tmpcal != "/") {
                                        subtitle = tmpcal;

                                        var re = /(?:\.([^.]+))?$/;
                                        extention = re.exec(tmpcal)[1];
                                    }
                                }

                                return (
                                    <Accordion
                                        defaultExpanded
                                        key={"Accordion" + i}
                                    >
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel-content"
                                        >
                                            <Typography
                                                variant="h5"
                                                color="initial"
                                            >
                                                {curnum + ". " + subtitle}
                                            </Typography>
                                        </AccordionSummary>
                                        <Divider />
                                        <AccordionDetails>
                                            {answer.extractedresults !=
                                                null && (
                                                <Box sx={{ mb: 5 }}>
                                                    <Typography
                                                        variant="h6"
                                                        gutterBottom
                                                        sx={{
                                                            fontWeight: "bold",
                                                        }}
                                                    >
                                                        Extractor
                                                    </Typography>
                                                    <Table borderAxis="both">
                                                        <thead>
                                                            <tr>
                                                                <th
                                                                    style={{
                                                                        width: "40%",
                                                                    }}
                                                                >
                                                                    Extractor
                                                                    Name
                                                                </th>
                                                                <th>
                                                                    Extractor
                                                                    Result
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr key="extractedresults_table">
                                                                <td>
                                                                    {
                                                                        answer.extractorname
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {answer.extractedresults.join(
                                                                        ", "
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </Table>
                                                </Box>
                                            )}
                                            <Typography
                                                variant="h6"
                                                gutterBottom
                                                sx={{
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                Raw Data
                                            </Typography>
                                            {answer.request && (
                                                <Accordion
                                                    key={"Accordion2" + i}
                                                >
                                                    <AccordionSummary
                                                        expandIcon={
                                                            <ExpandMoreIcon />
                                                        }
                                                        aria-controls="panel1-content"
                                                    >
                                                        <Typography
                                                            variant="subtitle2"
                                                            gutterBottom
                                                            sx={{
                                                                fontWeight:
                                                                    "bold",
                                                            }}
                                                        >
                                                            Request Header
                                                        </Typography>
                                                    </AccordionSummary>
                                                    <AccordionDetails>
                                                        <CodeBlock
                                                            text={
                                                                answer.request
                                                            }
                                                            language="go"
                                                            showLineNumbers={
                                                                false
                                                            }
                                                            theme={dracula}
                                                        />
                                                    </AccordionDetails>
                                                </Accordion>
                                            )}
                                            {headerpart && (
                                                <Accordion
                                                    // defaultExpanded
                                                    key={"Accordion3" + i}
                                                >
                                                    <AccordionSummary
                                                        expandIcon={
                                                            <ExpandMoreIcon />
                                                        }
                                                        aria-controls="panel1-content"
                                                    >
                                                        <Typography
                                                            variant="subtitle2"
                                                            gutterBottom
                                                            sx={{
                                                                fontWeight:
                                                                    "bold",
                                                            }}
                                                        >
                                                            Response Header
                                                        </Typography>
                                                    </AccordionSummary>
                                                    <AccordionDetails>
                                                        <CodeBlock
                                                            text={headerpart}
                                                            language="go"
                                                            showLineNumbers={
                                                                false
                                                            }
                                                            theme={dracula}
                                                        />
                                                    </AccordionDetails>
                                                </Accordion>
                                            )}
                                            {extention == "txt" && (
                                                <Accordion
                                                    // defaultExpanded
                                                    key={"Accordion4" + i}
                                                >
                                                    <AccordionSummary
                                                        expandIcon={
                                                            <ExpandMoreIcon />
                                                        }
                                                        aria-controls="panel1-content"
                                                    >
                                                        <Typography
                                                            variant="subtitle4"
                                                            gutterBottom
                                                            sx={{
                                                                fontWeight:
                                                                    "bold",
                                                            }}
                                                        >
                                                            Response Body
                                                        </Typography>
                                                    </AccordionSummary>
                                                    <AccordionDetails>
                                                        <CodeBlock
                                                            text={answer.response.substring(
                                                                period + 1
                                                            )}
                                                            language="go"
                                                            showLineNumbers={
                                                                false
                                                            }
                                                            theme={dracula}
                                                        />
                                                    </AccordionDetails>
                                                </Accordion>
                                            )}
                                        </AccordionDetails>
                                    </Accordion>
                                );
                            })}
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.closeDetails}>Close</Button>
                    </DialogActions>
                </Dialog>
            )
        );
    };

    componentDidMount() {
        const list = [];
        var indexid = 0;
        this.props.inputData.result.forEach((element) => {
            let ixid = list.find((value) => value.Name == element.info.name);
            if (!ixid) {
                list.push({
                    id: indexid,
                    Serverity: element.info.severityholder.severity,
                    Score:
                        element.info.hasOwnProperty("classification") &&
                        element.info.classification.cvssscore > 0
                            ? element.info.classification.cvssscore
                            : "N/A",
                    Name: element.info.name,
                    Family: "General",
                    Count: 1,
                });
                indexid++;
            } else {
                let ix = list.indexOf(ixid);
                list[ix].Count += 1;
            }
        });

        this.setState({
            rows: list,
        });
    }

    render() {
        return (
            <Box
                sx={{
                    height: 300,
                    width: "100%",
                    "& .Critical": {
                        backgroundColor: "#990000",
                        color: "#FFFFFF",
                    },
                    "& .High": {
                        backgroundColor: "#FF9933",
                        color: "#202020",
                    },
                    "& .Medium": {
                        backgroundColor: "#FFFF99",
                        color: "#202020",
                    },
                    "& .Low": {
                        backgroundColor: "#CCFF99",
                        color: "#202020",
                    },
                    "& .Info": {
                        backgroundColor: "#99CCFF",
                        color: "#202020",
                    },
                }}
            >
                <Box component="div" sx={{ display: "flex" }}>
                    <Box sx={{ width: "70%" }}>
                        <this.threatslist></this.threatslist>
                    </Box>
                    <Box sx={{ width: "30%", padding: "0 25px" }}>
                        <ScanDurations></ScanDurations>
                    </Box>
                </Box>
                <this.genVulnerabilitiesDetails></this.genVulnerabilitiesDetails>
            </Box>
        );
    }
}

export default ProjectVulnerabilities;
