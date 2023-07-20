import * as React from "react";

import {
    Box,
    Toolbar,
    Typography,
    Paper,
    Checkbox,
    IconButton,
    Tooltip,
    FormControlLabel,
    Switch,
} from "@mui/material";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
} from "@mui/material";

import PropTypes from "prop-types";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";

import { visuallyHidden } from "@mui/utils";
import { alpha } from "@mui/material/styles";

import { UnderLineMiniTitle } from "../component/page_style/project_style";

import CanvasJSReact from "@canvasjs/react-charts";


var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

export default class ProjectThreats extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            order: "desc",
            orderBy: "Start Time",
            selected: [],
            page: 0,
            dense: false,
            rowsPerPage: 10,
        };

        this.headCells = [
            {
                id: "Start Time",
                numeric: false,
                disablePadding: true,
                label: "Start Time",
            },
            {
                id: "Last Scanned",
                numeric: false,
                disablePadding: true,
                label: "Last Scanned",
            },
            {
                id: "Status",
                numeric: false,
                disablePadding: true,
                label: "Status",
            },
            
        ];

        this.createData = (Start_Time, Last_Scanned, Status) => {
            return {
                Start_Time,
                Last_Scanned,
                Status,
            };
        };

        this.rows = [
            this.createData("2020-11-21 at 11:18 AM", "2020-11-21 at 11:38 AM", "Completed"),
            this.createData("2020-11-22 at 11:18 AM", "2020-11-22 at 11:38 AM", "Completed"),
            this.createData("2020-11-23 at 11:18 AM", "2020-11-23 at 11:38 AM", "Completed"),
            this.createData("2020-11-24 at 11:18 AM", "2020-11-24 at 11:38 AM", "Completed"),
            this.createData("2020-11-25 at 11:18 AM", "2020-11-25 at 11:38 AM", "Completed"),
            this.createData("2020-11-26 at 11:18 AM", "2020-11-26 at 11:38 AM", "Completed"),
            this.createData("2020-11-27 at 11:18 AM", "2020-11-27 at 11:38 AM", "Completed"),
            this.createData("2020-11-28 at 11:18 AM", "2020-11-28 at 11:38 AM", "Completed"),
            this.createData("2020-11-29 at 11:18 AM", "2020-11-28 at 11:38 AM", "Completed"),
            this.createData("2020-11-30 at 11:18 AM", "2020-11-28 at 11:38 AM", "Completed"),
            this.createData("2020-12-01 at 11:18 AM", "2020-11-28 at 11:38 AM", "Completed"),
            this.createData("2020-12-02 at 11:18 AM", "2020-11-28 at 11:38 AM", "Completed"),
            this.createData("2020-12-03 at 11:18 AM", "2020-11-28 at 11:38 AM", "Completed"),
            this.createData("2020-12-04 at 11:18 AM", "2020-11-28 at 11:38 AM", "Completed"),
            this.createData("2020-12-05 at 11:18 AM", "2020-11-28 at 11:38 AM", "Completed"),
            this.createData("2020-12-06 at 11:18 AM", "2020-11-28 at 11:38 AM", "Completed"),
            this.createData("2020-12-07 at 11:18 AM", "2020-11-28 at 11:38 AM", "Completed"),
            this.createData("2020-12-08 at 11:18 AM", "2020-11-28 at 11:38 AM", "Completed"),
            this.createData("2020-12-09 at 11:18 AM", "2020-11-28 at 11:38 AM", "Completed"),
            this.createData("2020-12-10 at 11:18 AM", "2020-11-28 at 11:38 AM", "Completed"),
            
        ];
    }

    descendingComparator = (a, b, orderBy) => {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    };

    getComparator = (order, orderBy) => {
        return order === "desc"
            ? (a, b) => this.descendingComparator(a, b, orderBy)
            : (a, b) => -this.descendingComparator(a, b, orderBy);
    };

    stableSort = (array, comparator) => {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) {
                return order;
            }
            return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
    };

    
    render() {
        return (
            <Box component="div" sx={{ display: "flex" }}>
                <Box sx={{ width: "70%" }}>
                    <this.EnhancedTable
                        style={{ width: "75%" }}
                    ></this.EnhancedTable>
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
                                <td >Status:</td>
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
