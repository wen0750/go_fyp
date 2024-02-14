import * as React from "react";
import { Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import { UnderLineMiniTitle } from "../component/page_style/project_style";
import ScanDurations from "./project_ext_scan_durations";
import "../assets/css/threats.css";

class ProjectVulnerabilities extends React.Component {
    constructor(props) {
        super(props);
        this.state = { rows: [] };
        this.columns = [
            {
                field: "Serverity",
                flex: 1.5,
                width: 150,
                headerClassName: "gray-background",
                align: "center",
                headerAlign: "center",
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

    rows = [
        {
            id: 1,
            Serverity: "Info",
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
                        }
                        return (params.value = "Critical" ? "Critical" : "");
                    }}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 10 },
                        },
                    }}
                    pageSizeOptions={[5, 10, 15]}
                    checkboxSelection
                />
            </div>
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
            </Box>
        );
    }
}

export default ProjectVulnerabilities;
