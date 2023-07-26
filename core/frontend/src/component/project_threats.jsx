import * as React from "react";
import { Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import { UnderLineMiniTitle } from "../component/page_style/project_style";
import "../assets/css/threats.css";

import {
    ThreatsDetails,
    MiniTitle,
} from "../component/page_style/project_style";

class ProjectThreats extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.columns = [
            {
                field: "VRP Serverity",
                flex: 1.5,
                width: 150,
                headerClassName: "gray-background",
            },
            {
                field: "Name",
                flex: 5,
                width: 500,
                headerClassName: "gray-background",
            },
            {
                field: "Reasons",
                flex: 2,
                width: 200,
                headerClassName: "gray-background",
            },
            {
                field: "VRP Score",
                flex: 1,
                width: 150,
                headerClassName: "gray-background",
            },
            {
                field: "Hosts",
                flex: 1,
                width: 150,
                headerClassName: "gray-background",
            },
        ];
    }

    rows = [
        {
            id: 1,
            "VRP Serverity": "LOW",
            Name: "SSH",
            Reasons: "No recorded events",
            "VRP Score": "5.5",
            Hosts: "4",
        },
        {
            id: 2,
            "VRP Serverity": "Medium",
            Name: "wordpress",
            Reasons: "No recorded events",
            "VRP Score": "2.5",
            Hosts: "3",
        },
    ];

    riskLevel = () => {
        return (
            <div style={{ display: "flex", marginBlockEnd: "1rem" }}>
                <img
                    src="3_star_shield-removebg-preview.png"
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
                    rows={this.rows}
                    columns={this.columns}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 5 },
                        },
                    }}
                    pageSizeOptions={[5, 10]}
                />
            </div>
        );
    };

    render() {
        return (
            <Box component="div" sx={{ display: "flex" }}>
                <Box sx={{ width: "70%" }}>
                    <this.riskLevel></this.riskLevel>
                    <this.threatslist></this.threatslist>
                </Box>
                <Box sx={{ width: "30%", padding: "25px" }}>
                    <div style={{ marginBottom: "1rem" }}>
                        <UnderLineMiniTitle>Scan Durations</UnderLineMiniTitle>
                        <table>
                            <tr>
                                <td width="5%">Policy:</td>
                                <td width="20%">Basic Network Scan</td>
                            </tr>
                            <tr>
                                <td>Status:</td>
                                <td>Completed</td>
                            </tr>
                            <tr>
                                <td>Severity Base:</td>
                                <td>CVSS v3.0</td>
                            </tr>
                            <tr>
                                <td>Scanner:</td>
                                <td>Local Scanner</td>
                            </tr>
                            <tr>
                                <td>Start:</td>
                                <td>January 16 at 5:30 PM</td>
                            </tr>
                            <tr>
                                <td>End:</td>
                                <td>January 16 at 6:28 PM</td>
                            </tr>
                            <tr>
                                <td>Elapsed:</td>
                                <td>an hour</td>
                            </tr>
                        </table>
                    </div>
                </Box>
            </Box>
        );
    }
}

export default ProjectThreats;
