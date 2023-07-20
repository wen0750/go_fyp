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

    ThreatsBody = () => {
        return (
            <FormControl sx={{ my: 2, width: "25ch" }} variant="outlined">
                <OutlinedInput
                    id="outlined-adornment-weight"
                    endAdornment={
                        <InputAdornment position="end">
                            <SearchRoundedIcon />
                        </InputAdornment>
                    }
                    aria-describedby="outlined-weight-helper-text"
                    inputProps={{
                        "aria-label": "weight",
                    }}
                />
            </FormControl>
        );
    };

    ThreatsTable = () => {
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
                    checkboxSelection
                />
            </div>
        );
    };

    render() {
        return (
            <div>
                <this.ThreatsHeader />
                <div style={{ paddingInline: "25px" }}>
                    <this.ThreatsBody />
                    <this.ThreatsTable />
                </div>
            </div>
        );
    }

    
    
}            