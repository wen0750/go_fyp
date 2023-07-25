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

export default class ProjectHistory extends React.Component {
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
                id: "name",
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
            this.createData(
                "2020-11-21 at 11:18 AM",
                "2020-11-21 at 11:38 AM",
                "Completed"
            ),
            this.createData(
                "2020-11-22 at 11:18 AM",
                "2020-11-22 at 11:38 AM",
                "Completed"
            ),
            this.createData(
                "2020-11-23 at 11:18 AM",
                "2020-11-23 at 11:38 AM",
                "Completed"
            ),
            this.createData(
                "2020-11-24 at 11:18 AM",
                "2020-11-24 at 11:38 AM",
                "Completed"
            ),
            this.createData(
                "2020-11-25 at 11:18 AM",
                "2020-11-25 at 11:38 AM",
                "Completed"
            ),
            this.createData(
                "2020-11-26 at 11:18 AM",
                "2020-11-26 at 11:38 AM",
                "Completed"
            ),
            this.createData(
                "2020-11-27 at 11:18 AM",
                "2020-11-27 at 11:38 AM",
                "Completed"
            ),
            this.createData(
                "2020-11-28 at 11:18 AM",
                "2020-11-28 at 11:38 AM",
                "Completed"
            ),
            this.createData(
                "2020-11-29 at 11:18 AM",
                "2020-11-28 at 11:38 AM",
                "Completed"
            ),
            this.createData(
                "2020-11-30 at 11:18 AM",
                "2020-11-28 at 11:38 AM",
                "Completed"
            ),
            this.createData(
                "2020-12-01 at 11:18 AM",
                "2020-11-28 at 11:38 AM",
                "Completed"
            ),
            this.createData(
                "2020-12-02 at 11:18 AM",
                "2020-11-28 at 11:38 AM",
                "Completed"
            ),
            this.createData(
                "2020-12-03 at 11:18 AM",
                "2020-11-28 at 11:38 AM",
                "Completed"
            ),
            this.createData(
                "2020-12-04 at 11:18 AM",
                "2020-11-28 at 11:38 AM",
                "Completed"
            ),
            this.createData(
                "2020-12-05 at 11:18 AM",
                "2020-11-28 at 11:38 AM",
                "Completed"
            ),
            this.createData(
                "2020-12-06 at 11:18 AM",
                "2020-11-28 at 11:38 AM",
                "Completed"
            ),
            this.createData(
                "2020-12-07 at 11:18 AM",
                "2020-11-28 at 11:38 AM",
                "Completed"
            ),
            this.createData(
                "2020-12-08 at 11:18 AM",
                "2020-11-28 at 11:38 AM",
                "Completed"
            ),
            this.createData(
                "2020-12-09 at 11:18 AM",
                "2020-11-28 at 11:38 AM",
                "Completed"
            ),
            this.createData(
                "2020-12-10 at 11:18 AM",
                "2020-11-28 at 11:38 AM",
                "Completed"
            ),
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

    EnhancedTableHead = (props) => {
        const {
            onSelectAllClick,
            order,
            orderBy,
            numSelected,
            rowCount,
            onRequestSort,
        } = props;
        const createSortHandler = (property) => (event) => {
            onRequestSort(event, property);
        };

        return (
            <TableHead>
                <TableRow>
                    <TableCell padding="checkbox">
                        <Checkbox
                            color="primary"
                            indeterminate={
                                numSelected > 0 && numSelected < rowCount
                            }
                            checked={rowCount > 0 && numSelected === rowCount}
                            onChange={onSelectAllClick}
                            inputProps={{
                                "aria-label": "select all desserts",
                            }}
                        />
                    </TableCell>
                    {this.headCells.map((headCell) => (
                        <TableCell
                            key={headCell.id}
                            align={headCell.numeric ? "right" : "left"}
                            padding={
                                headCell.disablePadding ? "none" : "normal"
                            }
                            sortDirection={
                                orderBy === headCell.id ? order : false
                            }
                        >
                            <TableSortLabel
                                active={orderBy === headCell.id}
                                direction={
                                    orderBy === headCell.id ? order : "asc"
                                }
                                onClick={createSortHandler(headCell.id)}
                            >
                                {headCell.label}
                                {orderBy === headCell.id ? (
                                    <Box component="span" sx={visuallyHidden}>
                                        {order === "desc"
                                            ? "sorted descending"
                                            : "sorted ascending"}
                                    </Box>
                                ) : null}
                            </TableSortLabel>
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>
        );
    };

    EnhancedTableToolbar = (props) => {
        const { numSelected } = props;

        return (
            <Toolbar
                sx={{
                    pl: { sm: 2 },
                    pr: { xs: 1, sm: 1 },
                    ...(numSelected > 0 && {
                        bgcolor: (theme) =>
                            alpha(
                                theme.palette.primary.main,
                                theme.palette.action.activatedOpacity
                            ),
                    }),
                }}
            >
                {numSelected > 0 ? (
                    <Typography
                        sx={{ flex: "1 1 100%" }}
                        color="inherit"
                        variant="subtitle1"
                        component="div"
                    >
                        {numSelected} selected
                    </Typography>
                ) : (
                    <Typography
                        sx={{ flex: "1 1 100%" }}
                        variant="h6"
                        id="tableTitle"
                        component="div"
                    >
                        Scan History
                    </Typography>
                )}

                {numSelected > 0 ? (
                    <Tooltip title="Delete">
                        <IconButton>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                ) : (
                    <Tooltip title="Filter list">
                        <IconButton>
                            <FilterListIcon />
                        </IconButton>
                    </Tooltip>
                )}
            </Toolbar>
        );
    };

    EnhancedTable = () => {
        const setRowsPerPage = (newValue) => {
            this.setState({ rowsPerPage: newValue });
        };

        const setDense = (newValue) => {
            this.setState({ dense: newValue });
        };

        const setPage = (newValue) => {
            this.setState({ page: newValue });
        };

        const setSelected = (newValue) => {
            this.setState({ selected: newValue });
        };

        const setOrderBy = (newValue) => {
            this.setState({ orderBy: newValue });
        };

        const setOrder = (newValue) => {
            this.setState({ order: newValue });
        };

        const { order, orderBy, selected, page, dense, rowsPerPage } =
            this.state;

        this.EnhancedTableHead.propTypes = {
            numSelected: PropTypes.number.isRequired,
            onRequestSort: PropTypes.func.isRequired,
            onSelectAllClick: PropTypes.func.isRequired,
            order: PropTypes.oneOf(["asc", "desc"]).isRequired,
            orderBy: PropTypes.string.isRequired,
            rowCount: PropTypes.number.isRequired,
        };

        this.EnhancedTableToolbar.propTypes = {
            numSelected: PropTypes.number.isRequired,
        };

        const handleRequestSort = (event, property) => {
            const isAsc = orderBy === property && order === "asc";
            setOrder(isAsc ? "desc" : "asc");
            setOrderBy(property);
        };

        const handleSelectAllClick = (event) => {
            if (event.target.checked) {
                const newSelected = this.rows.map((n) => n.Start_Time);
                setSelected(newSelected);
                return;
            }
            setSelected([]);
        };

        const handleClick = (event, Start_Time) => {
            const selectedIndex = selected.indexOf(Start_Time);
            let newSelected = [];

            if (selectedIndex === -1) {
                newSelected = newSelected.concat(selected, Start_Time);
            } else if (selectedIndex === 0) {
                newSelected = newSelected.concat(selected.slice(1));
            } else if (selectedIndex === selected.length - 1) {
                newSelected = newSelected.concat(selected.slice(0, -1));
            } else if (selectedIndex > 0) {
                newSelected = newSelected.concat(
                    selected.slice(0, selectedIndex),
                    selected.slice(selectedIndex + 1)
                );
            }

            setSelected(newSelected);
        };

        const handleChangePage = (event, newPage) => {
            setPage(newPage);
        };

        const handleChangeRowsPerPage = (event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
        };

        const handleChangeDense = (event) => {
            setDense(event.target.checked);
        };

        const isSelected = (Start_Time) => selected.indexOf(Start_Time) !== -1;

        // Avoid a layout jump when reaching the last page with empty rows.
        const emptyRows =
            page > 0
                ? Math.max(0, (1 + page) * rowsPerPage - this.rows.length)
                : 0;

        const visibleRows = React.useMemo(
            () =>
                this.stableSort(
                    this.rows,
                    this.getComparator(order, orderBy)
                ).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
            [order, orderBy, page, rowsPerPage]
        );

        return (
            <Box sx={{ width: "100%" }}>
                <Paper sx={{ width: "100%", mb: 2 }}>
                    <this.EnhancedTableToolbar numSelected={selected.length} />
                    <TableContainer>
                        <Table
                            sx={{ minWidth: 750 }}
                            aria-labelledby="tableTitle"
                            size={dense ? "small" : "medium"}
                        >
                            <this.EnhancedTableHead
                                numSelected={selected.length}
                                order={order}
                                orderBy={orderBy}
                                onSelectAllClick={handleSelectAllClick}
                                onRequestSort={handleRequestSort}
                                rowCount={this.rows.length}
                            />
                            <TableBody>
                                {visibleRows.map((row, index) => {
                                    const isItemSelected = isSelected(
                                        row.Start_Time
                                    );
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            hover
                                            onClick={(event) =>
                                                handleClick(
                                                    event,
                                                    row.Start_Time
                                                )
                                            }
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={row.Start_Time}
                                            selected={isItemSelected}
                                            sx={{ cursor: "pointer" }}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    color="primary"
                                                    checked={isItemSelected}
                                                    inputProps={{
                                                        "aria-labelledby":
                                                            labelId,
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell
                                                component="th"
                                                id={labelId}
                                                scope="row"
                                                padding="none"
                                            >
                                                {row.Start_Time}
                                            </TableCell>
                                            <TableCell
                                                component="th"
                                                id={labelId}
                                                scope="row"
                                                padding="none"
                                            >
                                                {row.Last_Scanned}
                                            </TableCell>
                                            <TableCell
                                                component="th"
                                                id={labelId}
                                                scope="row"
                                                padding="none"
                                            >
                                                {row.Status}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10, 25]}
                        component="div"
                        count={this.rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
                <FormControlLabel
                    control={
                        <Switch checked={dense} onChange={handleChangeDense} />
                    }
                    label="Dense padding"
                />
            </Box>
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
        );
    }
}
