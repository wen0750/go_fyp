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

import ScanDurations from "./project_ext_scan_durations";
import globeVar from "../../GlobalVar";

export default class ProjectHistory extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // pid: props.projectID,
            order: "desc",
            orderBy: "Start Time",
            selected: [],
            page: 0,
            dense: false,
            rowsPerPage: 10,
            historyRecord: [],
            display: false,
            rows: [],
        };

        this.headCells = [
            {
                id: "startTime",
                numeric: false,
                disablePadding: true,
                label: "Start Time",
            },
            {
                id: "endTime",
                numeric: false,
                disablePadding: true,
                label: "End Time",
            },
            {
                id: "status",
                numeric: false,
                disablePadding: true,
                label: "Status",
            },
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

    EnhancedTable = (props) => {
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
                const newSelected = props.data.map((n) => n.Start_Time);
                setSelected(newSelected);
                return;
            }
            setSelected([]);
        };

        const handleClick = (event, id, starttime) => {
            this.props.onItemSelect(starttime);
            const selectedIndex = selected.indexOf(id);
            let newSelected = [];

            if (selectedIndex === -1) {
                newSelected = newSelected.concat(selected, id);
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
            this.props.onChangeHid(newSelected);
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
                ? Math.max(0, (1 + page) * rowsPerPage - props.data.length)
                : 0;

        const visibleRows = React.useMemo(
            () =>
                this.stableSort(
                    props.data,
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
                                rowCount={props.data.length}
                            />
                            <TableBody>
                                {visibleRows.map((row, index) => {
                                    const isItemSelected = isSelected(row._id);
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            hover
                                            onClick={(event) =>
                                                handleClick(
                                                    event,
                                                    row._id,
                                                    row.startTime
                                                )
                                            }
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={row._id}
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
                                                {new Date(
                                                    row.startTime * 1000
                                                ).toLocaleString()}
                                            </TableCell>
                                            <TableCell
                                                component="th"
                                                id={labelId}
                                                scope="row"
                                                padding="none"
                                            >
                                                {new Date(
                                                    row.endTime * 1000
                                                ).toLocaleString()}
                                            </TableCell>
                                            <TableCell
                                                component="th"
                                                id={labelId}
                                                scope="row"
                                                padding="none"
                                            >
                                                {row.status == "idle"
                                                    ? "Finish"
                                                    : row.status}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10, 15, 20, 25]}
                        component="div"
                        count={props.data.length}
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

    fetchHistoryRecord = async () => {
        try {
            const response = await fetch(
                `${globeVar.backendprotocol}://${globeVar.backendhost}/historyList/${this.props.projectID}`
            );
            const jsonData = await response.json();
            if (this.state.historyRecord != jsonData) {
                this.setState({ historyRecord: jsonData, display: true });
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    componentDidMount() {
        this.fetchHistoryRecord();
    }

    render() {
        return (
            <Box component="div" sx={{ display: "flex" }}>
                <Box sx={{ width: "70%" }}>
                    {this.state.display && (
                        <this.EnhancedTable
                            data={this.state.historyRecord}
                            style={{ width: "75%" }}
                        ></this.EnhancedTable>
                    )}
                </Box>

                <Box sx={{ width: "30%", padding: "0 25px" }}>
                    <ScanDurations></ScanDurations>
                </Box>
            </Box>
        );
    }
}
