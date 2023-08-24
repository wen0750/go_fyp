import * as React from "react";
import { Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import { UnderLineMiniTitle } from "../component/page_style/project_style";
import "../assets/css/threats.css";

class ProjectThreats extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.columns = [
            {
                field: "Serverity",
                flex: 1.5,
                width: 150,
                headerClassName: "gray-background",
                align: 'center',
                headerAlign: 'center',
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
                field: "Score",
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
            Serverity: 'Info',
            Name: "SSH",
            Reasons: "No recorded events",
            Score: "5.5",
            Hosts: "4",
        },
        {
            id: 2,
            Serverity: "Low",
            Name: "wordpress",
            Reasons: "No recorded events",
            Score: "2.5",
            Hosts: "3",
        },
        {
            id: 3,
            Serverity: "Medium",
            Name: "word",
            Reasons: "No recorded events",
            Score: "6.5",
            Hosts: "5",
        },
        {
            id: 4,
            Serverity: "High",
            Name: "wordpress",
            Reasons: "No recorded events",
            Score: "2.5",
            Hosts: "3",
        },
        {
            id: 5,
            Serverity: "Critical",
            Name: "wordpress",
            Reasons: "No recorded events",
            Score: "2.5",
            Hosts: "3",
        },
    ];

    riskLevel = () => {
        return (
            <div style={{ display: "flex", marginBlockEnd: "1rem" }}>
                <img
                    src="image/shield/3_star_shield-removebg-preview.png"
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
                    getCellClassName={(params) => {
                        if (params.field !== 'Serverity' || params.value == null) {
                          return '';
                        }
                        else if (params.value == "Info"){return 'Info';}                        
                        else if (params.value == "Low"){return 'Low';}
                        else if (params.value == "Medium"){return 'Medium';}  
                        else if (params.value == "High"){return 'High';}  
                        return params.value = "Critical" ? 'Critical' : '';
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

    render() {
        return (
            <Box
                sx={{
                    height: 300,
                    width: '100%',
                    '& .Critical': {
                        backgroundColor: '#990000',
                        color: '#FFFFFF',
                    },
                    '& .High': {
                        backgroundColor: '#FF9933',
                        color: '#202020',
                    },
                    '& .Medium': {
                        backgroundColor: '#FFFF99',
                        color: '#202020',
                    },
                    '& .Low': {
                        backgroundColor: '#CCFF99',
                        color: '#202020',
                    },
                    '& .Info': {
                        backgroundColor: '#99CCFF',
                        color: '#202020',
                    },
                }}
            >
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
            </Box>
        );
    }
}

export default ProjectThreats;
