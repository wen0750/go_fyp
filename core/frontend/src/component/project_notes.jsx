import * as React from "react";

import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel } from "@mui/material";

import PropTypes from "prop-types";
import { visuallyHidden } from "@mui/utils";

import ScanDurations from "./project_ext_scan_durations";

export default class ProjectNotes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            order: "asc",
            orderBy: "Name",
            selected: [],
            page: 0,
            rowsPerPage: 10,
            rows: [],
        };

        this.headCells = [
            {
                id: "Scan Notes",
                numeric: false,
                disablePadding: false,
                label: "Scan Notes",
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
        return order === "desc" ? (a, b) => this.descendingComparator(a, b, orderBy) : (a, b) => -this.descendingComparator(a, b, orderBy);
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
        const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
        const createSortHandler = (property) => (event) => {
            onRequestSort(event, property);
        };

        return (
            <TableHead sx={{ margin: 50 }}>
                <TableRow>
                    {this.headCells.map((headCell) => (
                        <TableCell
                            key={headCell.id}
                            align={headCell.numeric ? "right" : "left"}
                            padding={headCell.disablePadding ? "none" : "normal"}
                            sortDirection={orderBy === headCell.id ? order : false}
                        >
                            <TableSortLabel active={orderBy === headCell.id} direction={orderBy === headCell.id ? order : "asc"} onClick={createSortHandler(headCell.id)}>
                                {headCell.label}
                                {orderBy === headCell.id ? (
                                    <Box component="span" sx={visuallyHidden}>
                                        {order === "desc" ? "sorted descending" : "sorted ascending"}
                                    </Box>
                                ) : null}
                            </TableSortLabel>
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>
        );
    };

    EnhancedTable = () => {
        const setRowsPerPage = (newValue) => {
            this.setState({ rowsPerPage: newValue });
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

        const { order, orderBy, selected, page, rowsPerPage } = this.state;

        this.EnhancedTableHead.propTypes = {
            numSelected: PropTypes.number.isRequired,
            onRequestSort: PropTypes.func.isRequired,
            onSelectAllClick: PropTypes.func.isRequired,
            order: PropTypes.oneOf(["asc", "desc"]).isRequired,
            orderBy: PropTypes.string.isRequired,
            rowCount: PropTypes.number.isRequired,
        };

        const handleRequestSort = (event, property) => {
            const isAsc = orderBy === property && order === "asc";
            setOrder(isAsc ? "desc" : "asc");
            setOrderBy(property);
        };

        const handleSelectAllClick = (event) => {
            if (event.target.checked) {
                const newSelected = this.state.rows.map((n) => n.name);
                setSelected(newSelected);
                return;
            }
            setSelected([]);
        };

        const handleClick = (event, name) => {
            const selectedIndex = selected.indexOf(name);
            let newSelected = [];

            if (selectedIndex === -1) {
                newSelected = newSelected.concat(selected, name);
            } else if (selectedIndex === 0) {
                newSelected = newSelected.concat(selected.slice(1));
            } else if (selectedIndex === selected.length - 1) {
                newSelected = newSelected.concat(selected.slice(0, -1));
            } else if (selectedIndex > 0) {
                newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
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

        const isSelected = (name) => selected.indexOf(name) !== -1;

        // Avoid a layout jump when reaching the last page with empty rows.
        const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - this.state.rows.length) : 0;

        const visibleRows = React.useMemo(
            () => this.stableSort(this.state.rows, this.getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
            [order, orderBy, page, rowsPerPage]
        );

        return (
            <Box sx={{ width: "100%" }}>
                <Paper sx={{ width: "100%", mb: 2 }}>
                    <TableContainer>
                        <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={"medium"}>
                            <this.EnhancedTableHead
                                numSelected={selected.length}
                                order={order}
                                orderBy={orderBy}
                                onSelectAllClick={handleSelectAllClick}
                                onRequestSort={handleRequestSort}
                                rowCount={this.state.rows.length}
                            />
                            <TableBody>
                                {visibleRows.map((row, index) => {
                                    const isItemSelected = isSelected(row.name);
                                    const labelId = `enhanced-table-checkbox-${index}`;
                                    return (
                                        <TableRow
                                            hover
                                            onClick={(event) => handleClick(event, row.name)}
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={row.id}
                                            selected={isItemSelected}
                                            sx={{
                                                cursor: "pointer",
                                                paddingInline: "",
                                                margin: "15px",
                                            }}
                                        >
                                            <TableCell component="th" id={labelId} scope="row" padding="none" sx={{ paddingInline: "15px" }}>
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        color: "red",
                                                        margin: 0,
                                                    }}
                                                    gutterBottom
                                                >
                                                    {row.Name}
                                                </Typography>
                                                <Typography variant="subtitle2" sx={{ color: "black" }} gutterBottom>
                                                    {row.Description}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                                {emptyRows > 0 && (
                                    <TableRow
                                        style={{
                                            height: 53 * emptyRows,
                                        }}
                                    >
                                        <TableCell colSpan={6} />
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10, 25]}
                        component="div"
                        count={this.state.rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            </Box>
        );
    };

    static getDerivedStateFromProps(props, state) {
        if (Object.hasOwnProperty.call(props.inputData, "result")) {
            const list = [];
            var indexid = 0;
            props.inputData.result.forEach((element) => {
                let ixid = list.find((value) => value.Name == element.info.name);
                if (!ixid) {
                    list.push({
                        id: indexid,
                        Name: element.info.name,
                        Description: element.info.description,
                    });
                    indexid++;
                } else {
                    let ix = list.indexOf(ixid);
                    list[ix].Count += 1;
                }
            });
            return { rows: list };
        }
        return null;
    }

    render() {
        return (
            <Box component="div" sx={{ display: "flex" }}>
                <Box sx={{ width: "70%" }}>
                    <this.EnhancedTable></this.EnhancedTable>
                </Box>
                <Box sx={{ width: "30%", padding: "0 25px" }}>
                    <ScanDurations></ScanDurations>
                </Box>
            </Box>
        );
    }
}
