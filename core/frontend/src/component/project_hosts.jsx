import * as React from "react";
import { Component } from "react";

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

import { DataGrid } from "@mui/x-data-grid";
import { visuallyHidden } from "@mui/utils";
import { alpha } from "@mui/material/styles";

import { UnderLineMiniTitle } from "../component/page_style/project_style";

import CanvasJSReact from "@canvasjs/react-charts";
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

import StackedBar from "./project_ext_stackedBar";

export default class ProjectHosts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            order: "asc",
            orderBy: "calories",
            selected: [],
            page: 0,
            dense: false,
            rowsPerPage: 10,
            showStackedBar: 0,
            vulnerabilities: [],
        };

        this.headCells = [
            {
                id: "name",
                numeric: false,
                disablePadding: true,
                label: "Host",
            },
            {
                id: "calories",
                numeric: false,
                disablePadding: false,
                label: "Vulnerabilities",
            },
        ];

        this.createData = (name, calories, fat, carbs, protein) => {
            return {
                name,
                calories,
                fat,
                carbs,
                protein,
            };
        };

        this.rows = [
            this.createData("google.com", 1, 8, 2, 7),
            this.createData("facebook.com", 452, 25.0, 51, 4.9),
            this.createData("amazon.com", 262, 16.0, 24, 6.0),
            this.createData("imdb.com", 159, 6.0, 24, 4.0),
            this.createData("apple.com", 356, 16.0, 49, 3.9),
            this.createData("pinterest.com", 408, 3.2, 87, 6.5),
            this.createData("yelp.com", 237, 9.0, 37, 4.3),
            this.createData("tripadvisor.com", 3, 10, 9, 2),
            this.createData("wiktionary.org", 518, 26.0, 65, 7.0),
            this.createData("dictionary.com", 392, 0.2, 98, 0.0),
            this.createData("cambridge.org", 25.3, 87.5, 12.8, 56.7),
            this.createData("britannica.com", 360, 19.0, 9, 37.0),
            this.createData("microsoft.com", 6, 4, 8, 1),
            this.createData("walmart.com", 1.5, 75.8, 69.2, 22.1),
            this.createData("espn.com", 13.7, 57.2, 90.8, 4.3),
            this.createData("weather.com", 53.4, 27.6, 10.9, 94.3),
            this.createData("linkedin.com", 86.9, 3.2, 41.5, 59.1),
            this.createData("homedepot.com", 437, 18.0, 63, 4.0),
            this.createData("espncricinfo.com", 58.1, 33.6, 89.7, 22.4),
            this.createData("samsung.com", 19.7, 67.9, 56.3, 8.2),
            this.createData("craigslist.org", 69.4, 57.8, 16.3, 4.7),
            this.createData("gsmarena.com", 28.5, 72.3, 5.9, 50.2),
            this.createData("ebay.com", 76.9, 44.2, 12.5, 30.7),
            this.createData("mayoclinic.org", 17.2, 92.8, 41.3, 6.1),
            this.createData("cricbuzz.com", 94.1, 32.7, 79.4, 1.2),
            this.createData("timeanddate.com", 79.6, 85.5, 52.1, 34.3),
            this.createData("webmd.com", 9, 3, 2, 7),
            this.createData("thesaurus.com", 437, 18.0, 63, 4.0),
            this.createData("rottentomatoes.com", 60.2, 51.3, 18.9, 7.5),
            this.createData("bbc.com", 52.1, 94.8, 84.9, 47.4),
            this.createData("healthline.com", 15.6, 97.8, 88.1, 42.0),
            this.createData("netflix.com", 47.3, 81.9, 16.4, 38.1),
            this.createData("indeed.com", 72.4, 36.6, 81.0, 11.1),
            this.createData("thefreedictionary.com", 70.1, 10.4, 39.5, 51.8),
            this.createData("spotify.com", 98.5, 77.2, 65.9, 7.8),
            this.createData("livescore.com", 45.7, 8.2, 74.4, 63.2),
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
                                "aria-label": "select all hosts",
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
                        Vulnerabilities
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
                const newSelected = this.state.vulnerabilities.map(
                    (n) => n.name
                );
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
                newSelected = newSelected.concat(
                    selected.slice(0, selectedIndex),
                    selected.slice(selectedIndex + 1)
                );
            }

            setSelected(newSelected);
        };

        const handleChangePage = (event, newPage) => {
            setPage(newPage);
            this.setState({ showStackedBar: 1 });
        };

        const handleChangeRowsPerPage = (event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
        };

        const handleChangeDense = (event) => {
            setDense(event.target.checked);
        };

        const isSelected = (name) => selected.indexOf(name) !== -1;

        // Avoid a layout jump when reaching the last page with empty rows.
        const emptyRows =
            page > 0
                ? Math.max(
                      0,
                      (1 + page) * rowsPerPage -
                          this.state.vulnerabilities.length
                  )
                : 0;

        const visibleRows = React.useMemo(
            () =>
                this.stableSort(
                    this.state.vulnerabilities,
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
                                rowCount={this.state.vulnerabilities.length}
                            />
                            <TableBody>
                                {visibleRows.map((row, index) => {
                                    const isItemSelected = isSelected(row.name);
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            hover
                                            onClick={(event) =>
                                                handleClick(event, row.name)
                                            }
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={row.name}
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
                                                {row.name}
                                            </TableCell>
                                            <TableCell
                                                align="right"
                                                style={{
                                                    display: "flex",
                                                    padding: 0,
                                                }}
                                            >
                                                <StackedBar
                                                    isOpen={
                                                        this.state
                                                            .showStackedBar
                                                    }
                                                ></StackedBar>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                                {emptyRows > 0 && (
                                    <TableRow
                                        style={{
                                            height:
                                                (dense ? 33 : 53) * emptyRows,
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
                        count={this.state.vulnerabilities.length}
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
                    indexLabel: "{name}: {y}",
                    yValueFormatString: "#,###'%'",
                    radius: "120%",
                    innerRadius: "50%",
                    dataPoints: [
                        { name: "Unsatisfied", y: 5 },
                        { name: "Very Unsatisfied", y: 31 },
                        { name: "Very Satisfied", y: 40 },
                        { name: "Satisfied", y: 17 },
                        { name: "Neutral", y: 7 },
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
    componentDidMount() {
        this.setState({
            showStackedBar: 3,
        });
    }

    componentDidUpdate() {
        if (this.state.showStackedBar < 3) {
            setTimeout(() => {
                this.setState({
                    showStackedBar: this.state.showStackedBar + 1,
                });
            }, 100);
        }
    }

    static getDerivedStateFromProps(props, state) {
        // if (props.inputData !== state.result) {
        //     console.log(props.inputData);
        //     return {
        //         result: props.inputData,
        //     };
        // }

        // for (const key in props.inputData) {
        //     if (Object.hasOwnProperty.call(object, key)) {
        //         const element = object[key];
        //     }
        // }
        if (Object.hasOwnProperty.call(props.inputData, "result")) {
            console.log(props.inputData.result);

            const custList = [];

            for (const key in props.inputData.result) {
                if (Object.hasOwnProperty.call(props.inputData.result, key)) {
                    let obj = props.inputData.result[key];

                    if (Object.hasOwnProperty.call(custList, obj.ip)) {
                        switch (obj.info.severityholder.severity) {
                            case 6:
                                // code block
                                custList[obj.ip].critical += 1;
                                break;
                            case 4:
                                // code block
                                custList[obj.ip].high += 1;
                                break;
                            case 3:
                                // info
                                custList[obj.ip].medium += 1;
                                break;
                            case 2:
                                // code block
                                custList[obj.ip].low += 1;
                                break;
                            case 1:
                                // code block
                                custList[obj.ip].info += 1;
                                break;
                            case 0:
                                break;
                        }
                    } else {
                        custList[obj.ip] = {
                            ip: obj.ip,
                            critical: 0,
                            high: 0,
                            info: 0,
                            low: 0,
                            medium: 2,
                        };
                    }
                }
            }
            return { vulnerabilities: custList };
        }
        return null;
    }

    render() {
        return (
            <Box component="div" sx={{ display: "flex" }}>
                <Box sx={{ width: 3 / 4 }}>
                    <this.EnhancedTable
                        style={{ width: "75%" }}
                    ></this.EnhancedTable>
                </Box>
                <Box sx={{ width: 1 / 4, padding: "25px" }}>
                    <div style={{ marginBottom: "1rem" }}>
                        <UnderLineMiniTitle>Scan Durations</UnderLineMiniTitle>
                        <table>
                            <tr>
                                <td>Policy</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>Status</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>Severity Base</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>Scanner</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>Start</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>End</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>Elapsed</td>
                                <td></td>
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
