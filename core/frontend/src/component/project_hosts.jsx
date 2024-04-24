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
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    Divider,
    Button,
} from "@mui/material";

import Chip from "@mui/material-next/Chip";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { CodeBlock, dracula } from "react-code-blocks";
import { html_beautify } from "js-beautify";
import NewWindow from "react-new-window";

import PropTypes from "prop-types";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";

import { visuallyHidden } from "@mui/utils";
import { alpha } from "@mui/material/styles";

import StackedBar from "./project_ext_stackedBar";
import ScanDurations from "./project_ext_scan_durations";

import TableB from "@mui/joy/Table";

export default class ProjectHosts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            order: "asc",
            orderBy: "ip",
            selected: [],
            page: 0,
            dense: false,
            rowsPerPage: 10,
            showStackedBar: 0,
            vulnerabilities: [],
            result: props.inputData,
            rows: [],
            openDetails: false,
            threatDetails: [],
            popupList: [],
        };

        this.headCells = [
            {
                id: "ip",
                numeric: false,
                disablePadding: true,
                label: "Host",
            },
            {
                id: "total",
                numeric: false,
                disablePadding: false,
                label: "Vulnerabilities",
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
            <TableHead>
                <TableRow>
                    <TableCell padding="checkbox">
                        <Checkbox
                            color="primary"
                            indeterminate={numSelected > 0 && numSelected < rowCount}
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
                            padding={headCell.disablePadding ? "none" : "normal"}
                            sortDirection={orderBy === headCell.id ? order : false}
                        >
                            <TableSortLabel
                                active={orderBy === headCell.id}
                                direction={orderBy === headCell.id ? order : "asc"}
                                onClick={createSortHandler(headCell.id)}
                            >
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

    EnhancedTableToolbar = (props) => {
        const { numSelected } = props;

        return (
            <Toolbar
                sx={{
                    pl: { sm: 2 },
                    pr: { xs: 1, sm: 1 },
                    ...(numSelected > 0 && {
                        bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                    }),
                }}
            >
                {numSelected > 0 ? (
                    <Typography sx={{ flex: "1 1 100%" }} color="inherit" variant="subtitle1" component="div">
                        {numSelected} selected
                    </Typography>
                ) : (
                    <Typography sx={{ flex: "1 1 100%" }} variant="h6" id="tableTitle" component="div">
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

    closeDetails = () => {
        this.setState({ openDetails: false });
    };

    genVulnerabilitiesDetails = () => {
        const newpop = [];
        return (
            this.state.threatDetails.length > 0 && (
                <Dialog fullWidth={true} maxWidth={"xl"} open={this.state.openDetails} onClose={this.closeDetails}>
                    <DialogTitle
                        sx={{
                            margin: 0,
                            fontWeight: 400,
                            fontSize: "1.5rem",
                            lineHeight: 1.334,
                            letterSpacing: "0em",
                            color: "initial",
                        }}
                    >
                        {this.state.threatDetails[0].host}
                    </DialogTitle>
                    <Divider />
                    <DialogContent>
                        <Box>
                            {this.state.threatDetails.map((answer, i) => {
                                var period = answer.response.lastIndexOf("\r\n");
                                var headerpart = answer.response.substring(0, period);
                                // var htmlpart = answer.response.substring(
                                //     period + 1
                                // );
                                let curnum = i + 1;

                                var riskcolor = "";
                                var riskname = "";

                                switch (answer.info.severityholder.severity) {
                                    case 5:
                                        // code block
                                        riskcolor = "warning";
                                        riskname = "Critcal";
                                        break;
                                    case 4:
                                        // code block
                                        riskcolor = "warning";
                                        riskname = "High";
                                        break;
                                    case 3:
                                        // info
                                        riskcolor = "error";
                                        riskname = "Medium";
                                        break;
                                    case 2:
                                        // code block
                                        riskcolor = "warning";
                                        riskname = "Low";
                                        break;
                                    case 1:
                                        // code block
                                        riskcolor = "info";
                                        riskname = "Info";
                                        break;
                                    case 0:
                                        break;
                                }

                                var subtitle = answer.host;
                                var extention = "";
                                if (answer.request && answer.type == "http") {
                                    var tmpcal = answer.request.split("\r\n")[0].split(" ")[1];
                                    if (tmpcal != "/") {
                                        var re = /(?:\.([^.]+))?$/;
                                        extention = re.exec(tmpcal)[1];
                                    }
                                }

                                return (
                                    <Accordion defaultExpanded key={"Accordion" + i}>
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel-content">
                                            <Typography variant="h5" color="initial">
                                                <Chip color={riskcolor} label={riskname} />
                                                {"  "}
                                                {curnum + ". " + answer.info.name}
                                            </Typography>
                                        </AccordionSummary>
                                        <Divider />
                                        <AccordionDetails>
                                            <Box sx={{ mb: 5 }}>
                                                <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                                                    Description
                                                </Typography>
                                                <Typography variant="body1" gutterBottom>
                                                    {answer.info.description}
                                                </Typography>
                                            </Box>

                                            <Box sx={{ mb: 5 }}>
                                                <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                                                    Solution
                                                </Typography>
                                                <Typography variant="body1" gutterBottom>
                                                    {answer.info.remediation}
                                                </Typography>
                                            </Box>

                                            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                                                Output
                                            </Typography>
                                            <Divider />

                                            <Box sx={{ my: 3 }}>Target Host : {answer.host}</Box>

                                            {answer.extractedresults != null && (
                                                <Box sx={{ mb: 5 }}>
                                                    <Typography
                                                        variant="h6"
                                                        gutterBottom
                                                        sx={{
                                                            fontWeight: "bold",
                                                        }}
                                                    >
                                                        Extractor
                                                    </Typography>
                                                    <TableB borderAxis="both">
                                                        <thead>
                                                            <tr>
                                                                <th
                                                                    style={{
                                                                        width: "40%",
                                                                    }}
                                                                >
                                                                    Extractor Name
                                                                </th>
                                                                <th>Extractor Result</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr key="extractedresults_table">
                                                                <td>{answer.extractorname}</td>
                                                                <td>{answer.extractedresults.join(", ")}</td>
                                                            </tr>
                                                        </tbody>
                                                    </TableB>
                                                </Box>
                                            )}
                                            <Typography
                                                variant="h6"
                                                gutterBottom
                                                sx={{
                                                    fontWeight: "bold",
                                                    mt: 3,
                                                }}
                                            >
                                                Raw Data
                                            </Typography>
                                            {answer.request && (
                                                <Accordion key={"Accordion2" + i}>
                                                    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1-content">
                                                        <Typography
                                                            variant="subtitle2"
                                                            gutterBottom
                                                            sx={{
                                                                fontWeight: "bold",
                                                            }}
                                                        >
                                                            Request Header
                                                        </Typography>
                                                    </AccordionSummary>
                                                    <AccordionDetails>
                                                        <CodeBlock text={answer.request} language="go" showLineNumbers={false} theme={dracula} />
                                                    </AccordionDetails>
                                                </Accordion>
                                            )}
                                            {headerpart && (
                                                <Accordion
                                                    // defaultExpanded
                                                    key={"Accordion3" + i}
                                                >
                                                    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1-content">
                                                        <Typography
                                                            variant="subtitle2"
                                                            gutterBottom
                                                            sx={{
                                                                fontWeight: "bold",
                                                            }}
                                                        >
                                                            Response Header
                                                        </Typography>
                                                    </AccordionSummary>
                                                    <AccordionDetails>
                                                        <CodeBlock text={headerpart} language="go" showLineNumbers={false} theme={dracula} />
                                                    </AccordionDetails>
                                                </Accordion>
                                            )}
                                            {extention == "txt" && (
                                                <Accordion
                                                    // defaultExpanded
                                                    key={"Accordion4" + i}
                                                >
                                                    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1-content">
                                                        <Typography
                                                            variant="subtitle4"
                                                            gutterBottom
                                                            sx={{
                                                                fontWeight: "bold",
                                                            }}
                                                        >
                                                            Response Body
                                                        </Typography>
                                                    </AccordionSummary>
                                                    <AccordionDetails>
                                                        <CodeBlock
                                                            text={answer.response.substring(period + 1)}
                                                            language="go"
                                                            showLineNumbers={false}
                                                            theme={dracula}
                                                        />
                                                    </AccordionDetails>
                                                </Accordion>
                                            )}

                                            <Button variant="contained" onClick={() => this.toggleWindowPortal(i)} sx={{ my: 2 }}>
                                                Get Detail
                                            </Button>

                                            {this.state.popupList[i] == true && (
                                                <NewWindow
                                                    title={"Raw Respone of " + this.state.threatDetails[0].info.name + " - " + subtitle}
                                                    closeOnUnmount={false}
                                                >
                                                    <CodeBlock
                                                        text={html_beautify(answer.response)}
                                                        language="go"
                                                        showLineNumbers={false}
                                                        theme={dracula}
                                                    />
                                                </NewWindow>
                                            )}
                                        </AccordionDetails>
                                    </Accordion>
                                );
                            })}
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.closeDetails}>Close</Button>
                    </DialogActions>
                </Dialog>
            )
        );
    };

    toggleWindowPortal = (k) => {
        const nv = this.state.popupList;
        nv[k] = !nv[k];
        this.setState({ popupList: nv });
    };

    closeWindowPortal = (k) => {
        const nv = this.state.popupList;
        nv[k] = false;
        this.setState({ popupList: nv });
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

        const { order, orderBy, selected, page, dense, rowsPerPage } = this.state;

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
                const newSelected = this.state.vulnerabilities.map((n) => n.name);
                setSelected(newSelected);
                return;
            }
            setSelected([]);
        };

        const handleClick = (event, name, hostname) => {
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

            const list = [];
            console.log(this.state.result.result);

            this.state.result.result.forEach((element) => {
                console.log([element.host, hostname]);
                if (element.host == hostname || hostname == element.host.split(":")[0]) {
                    list.push(element);
                }
            });

            this.setState({
                // selected: newSelected,
                openDetails: true,
                threatDetails: list,
                popupList: Array.apply(null, { length: list.length }).map(function (x) {
                    return false;
                }),
            });
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
        const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - this.state.vulnerabilities.length) : 0;

        console.log(this.state.vulnerabilities);
        const visibleRows = React.useMemo(
            () =>
                this.stableSort(this.state.vulnerabilities, this.getComparator(order, orderBy)).slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                ),
            [order, orderBy, page, rowsPerPage]
        );

        return (
            <Box sx={{ width: "100%" }}>
                <Paper sx={{ width: "100%", mb: 2 }}>
                    <this.EnhancedTableToolbar numSelected={selected.length} />
                    <TableContainer>
                        <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={dense ? "small" : "medium"}>
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
                                    const isItemSelected = isSelected(row.ip);
                                    const labelId = `enhanced-table-checkbox-${index}`;
                                    return (
                                        <TableRow
                                            hover
                                            onClick={(event) => handleClick(event, row.ip, row.host)}
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={row.ip}
                                            selected={isItemSelected}
                                            sx={{ cursor: "pointer" }}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    color="primary"
                                                    checked={isItemSelected}
                                                    inputProps={{
                                                        "aria-labelledby": labelId,
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell component="th" id={labelId} scope="row" padding="none">
                                                {row.host ? row.host : row.ip}
                                            </TableCell>
                                            <TableCell
                                                align="right"
                                                style={{
                                                    display: "flex",
                                                    padding: 0,
                                                }}
                                            >
                                                <StackedBar rowData={row} isOpen={this.state.showStackedBar}></StackedBar>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                                {emptyRows > 0 && (
                                    <TableRow
                                        style={{
                                            height: (dense ? 33 : 53) * emptyRows,
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
                <FormControlLabel control={<Switch checked={dense} onChange={handleChangeDense} />} label="Dense padding" />
            </Box>
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
        if (Object.hasOwnProperty.call(props.inputData, "result")) {
            const custList = [];
            const indexer = [];
            for (const key in props.inputData.result) {
                if (Object.hasOwnProperty.call(props.inputData.result, key)) {
                    let obj = props.inputData.result[key];
                    var indexofip = indexer.indexOf(obj.ip);
                    if (indexofip < 0) {
                        indexer.push(obj.ip);
                        custList.push({
                            ip: obj.ip,
                            total: 0,
                            critical: 0,
                            high: 0,
                            info: 0,
                            low: 0,
                            medium: 0,
                            host: obj.host,
                        });
                        indexofip = indexer.length - 1;
                    }

                    switch (obj.info.severityholder.severity) {
                        case 5:
                            // code block
                            custList[indexofip].critical += 1;
                            custList[indexofip].total += 1;
                            break;
                        case 4:
                            // code block
                            custList[indexofip].high += 1;
                            custList[indexofip].total += 1;
                            break;
                        case 3:
                            // info
                            custList[indexofip].medium += 1;
                            custList[indexofip].total += 1;
                            break;
                        case 2:
                            // code block
                            custList[indexofip].low += 1;
                            custList[indexofip].total += 1;
                            break;
                        case 1:
                            // code block
                            custList[indexofip].info += 1;
                            custList[indexofip].total += 1;
                            break;
                        case 0:
                            break;
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
                <Box sx={{ width: 7 / 10 }}>
                    <this.EnhancedTable style={{ width: "75%" }}></this.EnhancedTable>
                </Box>
                <Box sx={{ width: 3 / 10, padding: "0 25px" }}>
                    <ScanDurations data={this.props.inputData}></ScanDurations>
                </Box>
                <this.genVulnerabilitiesDetails></this.genVulnerabilitiesDetails>
            </Box>
        );
    }
}
