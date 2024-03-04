import * as React from "react";
import { Box, Button } from "@mui/material";
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

import { CopyBlock, dracula } from "react-code-blocks";

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
        this.setState({ openDetails: true, threatDetails: list });
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
        console.log(this.state.threatDetails);
        return (
            this.state.threatDetails.length > 0 && (
                <Dialog
                    fullWidth={true}
                    maxWidth={"xl"}
                    open={this.state.openDetails}
                    onClose={this.closeDetails}
                >
                    <DialogTitle>
                        {this.state.threatDetails[0].info.name}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {this.state.threatDetails[0].info.description}
                        </DialogContentText>
                        <Accordion defaultExpanded>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1-content"
                                id="panel1-header"
                            >
                                Accordion 1
                            </AccordionSummary>
                            <AccordionDetails>
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit. Suspendisse malesuada lacus ex,
                                sit amet blandit leo lobortis eget.
                            </AccordionDetails>
                        </Accordion>

                        {this.state.threatDetails.map((answer, i) => {
                            var period = answer.response.lastIndexOf("\r\n");
                            var headerpart = answer.response.substring(
                                0,
                                period
                            );
                            var htmlpart = answer.response.substring(
                                period + 1
                            );

                            return (
                                <Accordion
                                    defaultExpanded
                                    key={"Accordion" + i}
                                >
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1-content"
                                    >
                                        {answer.host}
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        Header
                                        <CopyBlock
                                            language="go"
                                            text={headerpart}
                                            codeBlock
                                            theme={dracula}
                                            showLineNumbers={false}
                                        />
                                        <CopyBlock
                                            language="html"
                                            text={htmlpart}
                                            codeBlock
                                            theme={dracula}
                                            showLineNumbers={false}
                                        />
                                    </AccordionDetails>
                                </Accordion>
                            );
                        })}
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
                    Score: element.info.hasOwnProperty("classification")
                        ? element.info.classification.cvssscore
                        : 0,
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
