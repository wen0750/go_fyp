import * as React from "react";
import { Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import { UnderLineMiniTitle } from "../component/page_style/project_style";
import ScanDurations from "./project_ext_scan_durations";
import "../assets/css/threats.css";

class ProjectThreats extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rows: props.inputData,
        };
        this.columns = [
            {
                field: "serverity",
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
                    return params.value;
                },
            },
            {
                field: "name",
                flex: 5,
                width: 500,
                headerClassName: "gray-background",
            },
            // {
            //     field: "info.description",
            //     flex: 2,
            //     width: 200,
            //     headerClassName: "gray-background",
            // },
            {
                field: "score",
                flex: 1,
                width: 150,
                headerClassName: "gray-background",
            },
            {
                field: "count",
                flex: 1,
                width: 150,
                headerClassName: "gray-background",
            },
        ];
    }

    riskLevel = () => {
        return (
            <div style={{ display: "flex", marginBlockEnd: "1rem" }}>
                <img
                    src="../image/shield/3_star_shield-removebg-preview.png"
                    alt=""
                    width="125"
                    height="125"
                    style={{ padding: "10px" }}
                />
                <div>
                    <p>
                        Assessed Threat Level: <b>Medium</b>
                    </p>
                    <p>
                        The following vulnerabilities are ranked by Tenable's
                        patented Vulnerability Priority Rating (VPR) system.The
                        findings listed below detail the top ten
                        vulnerabilities,providing a prioritized view to help
                        guide remediation to effectively reduce risk. Click on
                        each finding to show further details along with the
                        impacted hosts. To learn more about Tenabl's VPR scoring
                        system, See Predictive Prioritization.
                    </p>
                </div>
            </div>
        );
    };

    threatslist = () => {
        return (
            <div style={{ height: "100%", width: "100%" }}>
                <DataGrid
                    rows={this.state.rows}
                    columns={this.columns}
                    getCellClassName={(params) => {
                        if (
                            params.field == "Serverity" ||
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
                    pageSizeOptions={[5, 10]}
                />
            </div>
        );
    };

    static getDerivedStateFromProps(props, state) {
        if (Object.hasOwnProperty.call(props.inputData, "result")) {
            const list = [];
            var indexid = 0;
            props.inputData.result.forEach((element) => {
                let ixid = list.find(
                    (value) => value.name == element.info.name
                );
                if (!ixid) {
                    list.push({
                        id: indexid,
                        serverity: element.info.severityholder.severity,
                        name: element.info.name,
                        score: element.info.classification
                            ? element.info.classification.cvssscore
                            : 0,
                        count: 1,
                    });
                    indexid++;
                } else {
                    let ix = list.indexOf(ixid);
                    list[ix].count += 1;
                }
            });
            return { rows: list };
        }
        return null;
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
                        <this.riskLevel></this.riskLevel>
                        <this.threatslist></this.threatslist>
                    </Box>
                    <Box sx={{ width: "30%", padding: "0 25px" }}>
                        <ScanDurations></ScanDurations>
                    </Box>
                </Box>
            </Box>
        );
    }
}

export default ProjectThreats;
