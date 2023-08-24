import * as React from "react";
import { Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import { UnderLineMiniTitle } from "../component/page_style/project_style";
import CanvasJSReact from "@canvasjs/react-charts";
import "../assets/css/threats.css";

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class ProjectVulnerabilities extends React.Component {
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
                field: "Score",
                flex: 0.8,
                width: 100,
                headerClassName: "gray-background",
                align: 'center',
                headerAlign: 'center',
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

    rows = [
        {
            id: 1,
            Serverity: 'Info',
            Score: "5.5",
            Name: "SSH",
            Family: "Misc",
            Count: "4",
        },
        {
            id: 2,
            Serverity: "Low",
            Score: "5.5",
            Name: "wordpress",
            Family: "Firewalls",
            Count: "3",
        },
        {
            id: 3,
            Serverity: "Medium",
            Score: "5.5",
            Name: "word",
            Family: "Web Servers",
            Count: "5",
        },
        {
            id: 4,
            Serverity: "High",
            Score: "5.5",
            Name: "wordpress",
            Family: "General",
            Count: "3",
        },
        {
            id: 5,
            Serverity: "Critical",
            Score: "5.5",
            Name: "wordpress",
            Family: "General",
            Count: "3",
        },
    ];

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
                    checkboxSelection
                />
            </div>
        );
    };

    VulnerabilitiesPiChart = () => {
        // const { data: chartData } = this.state;
        const options = {
            animationEnabled: true,
            legend: {
                cursor: "pointer",
                verticalAlign: "center",
                horizontalAlign: "right",
            },
            data: [
                {
                    type: "doughnut",
                    showInLegend: true,
                    yValueFormatString: "#,###'%'",
                    radius: "120%",
                    innerRadius: "50%",
                    dataPoints: [
                        { name: "Critical", y: 2 },
                        { name: "High", y: 3 },
                        { name: "Medium", y: 13 },
                        { name: "Low", y: 7 },
                        { name: "info", y: 75 },
                    ],
                },
            ],
        };
        return (
            <div>
                <CanvasJSChart
                    options={options}
                    /* onRef={ref => this.chart = ref} */
                />
                {/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
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
                    <div>
                        <UnderLineMiniTitle>Vulnerabilities</UnderLineMiniTitle>
                        <this.VulnerabilitiesPiChart></this.VulnerabilitiesPiChart>
                    </div>
                </Box>
            </Box>
            </Box>
        );
    }
}

export default ProjectVulnerabilities;
