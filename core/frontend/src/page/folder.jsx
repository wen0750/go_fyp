import * as React from "react";
import {
    Box,
    Button,
    IconButton,
    Tooltip,
    Typography,
    Modal,
} from "@mui/material";
import { Chip, Autocomplete, TextField, Stack } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

import { DataGrid } from "@mui/x-data-grid";
import Grid from "@mui/material/Grid";
import { OutlinedInput, InputAdornment, FormControl } from "@mui/material";

import { green } from "@mui/material/colors";
import { FolderHeader } from "../component/page_style/folder_style";

import InputTags from "../component/ext_chips_input";
import globeVar from "../../GlobalVar";

// Icon
import ControlPointRoundedIcon from "@mui/icons-material/ControlPointRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ReplayIcon from "@mui/icons-material/Replay";
import PauseIcon from "@mui/icons-material/Pause";
import StopIcon from "@mui/icons-material/Stop";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";

class ProjectFolder extends React.Component {
    constructor(props) {
        super(props);
        this.rows = [
            {
                id: 1,
                name: "CVE-2020-26067",
                schedule: "CVE-2020-26067",
                lastscanned: "2020-8-12 3:12:02",
                tid: "64b8f5bb922b684322bd3e81",
                action: "scanning",
            },
            {
                id: 2,
                name: "CVE-2021-26119",
                schedule: "CVE-2021-26119",
                lastscanned: "2021-5-04 12:03:18",
                tid: "",
                action: "paused",
            },
            {
                id: 3,
                name: "api_endpoints",
                schedule: "api_endpoints",
                lastscanned: "2020-3-24 9:35:23",
                tid: "",
                action: "stoped",
            },
            {
                id: 4,
                name: "CVE-2017-7504",
                schedule: "CVE-2017-7504",
                lastscanned: "2017-8-26 1:25:09",
                tid: "",
                action: "idle",
            },
            {
                id: 5,
                name: "CVE-2017-12636",
                schedule: "CVE-2017-12636",
                lastscanned: "2017-11-04 3:47:06",
                tid: "",
                action: { PlayArrowIcon },
            },
            {
                id: 6,
                name: "CVE-2020-1147",
                schedule: "CVE-2020-1147",
                lastscanned: "2020-1-9 11:17:11",
                tid: "",
                action: { PlayArrowIcon },
            },
            {
                id: 7,
                name: "CVE-2021-22123",
                schedule: "CVE-2021-22123",
                lastscanned: "2021-9-19 2:53:20",
                tid: "",
                action: { PlayArrowIcon },
            },
            {
                id: 8,
                name: "CVE-2021-36580",
                schedule: "CVE-2021-36580",
                lastscanned: "2021-6-8 8:43:03",
                tid: "",
                action: { PlayArrowIcon },
            },
            {
                id: 9,
                name: "CVE-2022-23642",
                schedule: "CVE-2022-23642",
                lastscanned: "2022-3-14 2:08:16",
                tid: "",
                action: { PlayArrowIcon },
            },
        ];
        this.state = {
            newScanModalIsOpen: false,
            createFolderModalIsOpen: false,
            modalLoading: false,
            modalSuccess: false,
            selectedTIDs: [],
            rows: this.rows,
            folderContent: this.rows,
        };
        this.newScanModalStyle = {
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            bgcolor: "background.paper",
            borderRadius: "5px",
            // border: "2px solid #000",
            boxShadow: 24,
            p: 4,
        };
        this.modalButtonSx = {
            ...(this.modalSuccess && {
                bgcolor: green[500],
                "&:hover": {
                    bgcolor: green[700],
                },
            }),
        };
        this.columns = [
            {
                field: "name",
                headerName: "Name",
                width: 250,
                minWidth: 150,
                maxWidth: 400,
            },
            {
                field: "schedule",
                headerName: "Schedule",
                width: 250,
                minWidth: 150,
                maxWidth: 400,
            },
            {
                field: "lastscanned",
                headerName: "Last Scanned",
                width: 250,
                minWidth: 150,
                maxWidth: 400,
            },
            {
                field: "action",
                headerName: "Action",
                sortable: false,
                width: 150,
                minWidth: 50,
                maxWidth: 300,
                renderCell: (params) => this.renderActionButton(params),
            },
            {
                field: "",
                headerName: "Remove",
                sortable: false,
                width: 100,
                minWidth: 50,
                maxWidth: 200,
                renderCell: (params) => (
                    <Tooltip title="Delete" placement="right">
                        <IconButton
                            aria-label="remove this project from project"
                            onClick={() =>
                                this.handleRemoveProject(params.row.id)
                            }
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                ),
            },
        ];
    }

    //
    // ┏┓  ┓┓  ┏┓  •
    // ┃ ┏┓┃┃  ┣┫┏┓┓
    // ┗┛┗┻┗┗  ┛┗┣┛┗
    //           ┛
    //
    fetchFoldersDetail = (fid) => {
        var result;
        fetch(
            `${globeVar.backendprotocol}://${globeVar.backendhost}/folder/details`,
            {
                method: "POST",
                body: JSON.stringify({
                    fid: fid,
                }),
            }
        )
            // Converting to JSON
            .then((response) => response.json())

            // Displaying results to console
            .then((json) => {
                if (json[0].project.length > 0) {
                    json[0].project.forEach((item, i) => {
                        item.id = i + 1;
                    });
                    this.setState({ folderContent: json[0].project });
                } else {
                    if (this.state.folderContent !== this.rows) {
                        this.setState({ folderContent: this.rows });
                    }
                }
            });
    };

    createNewFolder = () => {
        fetch(
            `${globeVar.backendprotocol}://${globeVar.backendhost}/folder/create`,
            {
                method: "POST",
                body: JSON.stringify({
                    name: "Folder H",
                }),
            }
        )
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                // Handle data
            })
            .catch((err) => {
                console.log(err.message);
            });
    };

    createNewProject = () => {
        fetch(
            `${globeVar.backendprotocol}://${globeVar.backendhost}/project/create`,
            {
                method: "POST",
                body: JSON.stringify({
                    name: "test3",
                    fid: "64bf73043cf5c58b00658727",
                    host: ["127.0.0.1", "123.45.67.30"],
                    poc: ["20231123001"],
                    template: "customs",
                }),
            }
        )
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                // Handle data
            })
            .catch((err) => {
                console.log(err.message);
            });
    };

    //
    // ┳┳  •    ┳┓   •
    // ┃┃  ┓    ┃┃┏┓┏┓┏┓┏┓
    // ┗┛  ┗    ┻┛┗ ┛┗┗┫┛┗
    //                 ┛
    renderActionButton = (param) => {
        switch (param.row.action) {
            case "scanning":
                return (
                    <div>
                        <Tooltip title="Pause">
                            <IconButton
                                aria-label="take action for this project"
                                onClick={() =>
                                    this.handleAction(param.row.id, "Pause")
                                }
                            >
                                <PauseIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Stop">
                            <IconButton
                                aria-label="take action for this project"
                                onClick={() =>
                                    this.handleAction(param.row.id, "Stop")
                                }
                            >
                                <StopIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Rescan">
                            <IconButton
                                aria-label="take action for this project"
                                onClick={() =>
                                    this.handleAction(param.row.id, "Restart")
                                }
                            >
                                <ReplayIcon />
                            </IconButton>
                        </Tooltip>
                    </div>
                );
            case "paused":
                return (
                    <div>
                        <Tooltip title="Resume">
                            <IconButton
                                aria-label="take action for this project"
                                onClick={() =>
                                    this.handleAction(param.row.id, "Resume")
                                }
                            >
                                <PlayArrowIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Stop">
                            <IconButton
                                aria-label="take action for this project"
                                onClick={() =>
                                    this.handleAction(param.row.id, "Stop")
                                }
                            >
                                <StopIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Rescan">
                            <IconButton
                                aria-label="take action for this project"
                                onClick={() =>
                                    this.handleAction(param.row.id, "Restart")
                                }
                            >
                                <ReplayIcon />
                            </IconButton>
                        </Tooltip>
                    </div>
                );
            case "idle":
                return (
                    <Tooltip title="Scan Now">
                        <IconButton
                            aria-label="take action for this project"
                            onClick={() =>
                                this.handleAction(param.row.id, "Scan")
                            }
                        >
                            <PlayArrowIcon />
                        </IconButton>
                    </Tooltip>
                );
            default:
                return (
                    <Tooltip title="Scan Now">
                        <IconButton
                            aria-label="take action for this project"
                            onClick={() =>
                                this.handleAction(param.row.id, "Scan")
                            }
                        >
                            <PlayArrowIcon />
                        </IconButton>
                    </Tooltip>
                );
        }
    };

    handleAction = (id, action) => {
        // Find the index of the row with the given id
        const rowIndex = this.state.rows.findIndex((object) => {
            return object.id === id;
        });

        if (rowIndex === -1) return; // If row not found, don't do anything

        // Copy the current state's rows
        const newRows = [...this.state.rows];

        // Action control &&
        // Change the action of the row with the given id to "scanning"
        switch (action) {
            case "Scan":
                newRows[rowIndex].action = "scanning";
                // this.projectActionScan(id);
                break;
            case "Pause":
                newRows[rowIndex].action = "paused";
                // this.projectActionPause(id);
                break;
            case "Stop":
                newRows[rowIndex].action = "idle";
                // this.projectActionStop(id);
                break;
            case "Resume":
                newRows[rowIndex].action = "scanning";
                // this.projectActionResume(id);
                break;
            case "Restart":
                newRows[rowIndex].action = "scanning";
                // this.projectActionRestart(id);
                break;
        }
        // Update the state with the new rows
        this.setState({ rows: newRows });
        console.log(`Action button clicked for id: ${id}`);
    };

    projectActionScan = () => {};
    projectActionPause = () => {};
    projectActionStop = () => {};
    projectActionResume = () => {};
    projectActionRestart = () => {};

    handleRemoveProject = (id) => {
        // Handle remove here
        console.log(`Remove button clicked for id: ${id}`);
    };

    openNewScanModal = () => {
        this.setState({ newScanModalIsOpen: true });
    };

    closeNewScanModal = () => {
        this.setState({ newScanModalIsOpen: false });
    };

    openCreateFolderModal = () => {
        this.setState({ createFolderModalIsOpen: true });
    };

    closeCreateFolderModal = () => {
        this.setState({ createFolderModalIsOpen: false });
    };

    newScanModal = () => {
        var pocs = [];
        pocs = this.rows;
        return (
            <div>
                <Modal
                    open={this.state.newScanModalIsOpen}
                    onClose={this.closeNewScanModal}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={this.newScanModalStyle}>
                        <Typography
                            id="modal-modal-title"
                            variant="h6"
                            component="h2"
                        >
                            Text in a modal
                        </Typography>
                        <Stack spacing={3} sx={{ width: 1, marginBlock: 1 }}>
                            <TextField
                                id="outlined-basic"
                                label="Outlined"
                                variant="outlined"
                            />
                            <InputTags></InputTags>
                            <Autocomplete
                                multiple
                                id="tags-outlined"
                                options={pocs}
                                getOptionLabel={(option) => option.lastName}
                                defaultValue={[this.rows[1]]}
                                filterSelectedOptions
                                onChange={(event, newValue) => {
                                    console.log(newValue); // log the new value
                                    this.setState({
                                        selectedTIDs: newValue
                                            .filter((item) => item.tid)
                                            .map((item) => item.tid),
                                    });
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Select POCs of this project"
                                        placeholder="POCs (ex. CVE-2013-2621.yaml)"
                                    />
                                )}
                            />
                        </Stack>
                        <Grid
                            container
                            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                            sx={{ mt: 3, marginLeft: 0, width: 1 }}
                        >
                            <Grid
                                item
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                xs={6}
                            >
                                <Button
                                    variant="outlined"
                                    startIcon={<DeleteIcon />}
                                    onClick={this.closeNewScanModal}
                                    color="error"
                                >
                                    Cancel
                                </Button>
                            </Grid>
                            <Grid
                                item
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                xs={6}
                            >
                                <Button
                                    variant="contained"
                                    endIcon={<SendIcon />}
                                    onClick={this.createNewProject}
                                >
                                    Send
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Modal>
            </div>
        );
    };

    createProjectModal = () => {
        var pocs = [];
        pocs = this.rows;
        return (
            <div>
                <Modal
                    open={this.state.createFolderModalIsOpen}
                    onClose={this.closeCreateFolderModal}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={this.newScanModalStyle}>
                        <Typography
                            id="modal-modal-title"
                            variant="h6"
                            component="h2"
                        >
                            Text in a modal
                        </Typography>
                        <Stack spacing={3} sx={{ width: 1, marginBlock: 1 }}>
                            <TextField
                                id="outlined-basic"
                                label="Outlined"
                                variant="outlined"
                            />
                        </Stack>
                        <Grid
                            container
                            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                            sx={{ mt: 3, marginLeft: 0, width: 1 }}
                        >
                            <Grid
                                item
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                xs={6}
                            >
                                <Button
                                    variant="outlined"
                                    startIcon={<DeleteIcon />}
                                    onClick={this.closeCreateFolderModal}
                                    color="error"
                                >
                                    Cancel
                                </Button>
                            </Grid>
                            <Grid
                                item
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                xs={6}
                            >
                                <Button
                                    variant="contained"
                                    endIcon={<SendIcon />}
                                    onEnded
                                >
                                    Send
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Modal>
            </div>
        );
    };

    handleModalButtonClick = () => {
        // this.closeNewScanModal();
        if (!this.state.modalLoading) {
            this.setState({ modalLoading: true });
            timer.current = window.setTimeout(() => {
                this.setState({ modalLoading: true });
                this.setState({ modalSuccess: false });
            }, 2000);
        }
    };

    projectHeader = () => {
        return (
            <Box
                sx={{
                    width: "100%",
                    borderBottom: 1,
                    borderColor: "divider",
                    py: 2,
                    px: 3,
                }}
            >
                <FolderHeader>
                    <h1>MyProject</h1>
                    <div>
                        <Button variant="outlined" sx={{ mx: 1 }}>
                            Import
                        </Button>
                        <Button
                            variant="outlined"
                            sx={{ mx: 1 }}
                            onClick={this.openCreateFolderModal}
                        >
                            New Folder
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<ControlPointRoundedIcon />}
                            onClick={this.openNewScanModal}
                            sx={{ mx: 1 }}
                        >
                            Create Project
                            {/* this was a template */}
                        </Button>
                    </div>
                </FolderHeader>
            </Box>
        );
    };

    projectBody = () => {
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

    projectTable = () => {
        return (
            <div style={{ height: "100%", width: "100%" }}>
                <DataGrid
                    rows={this.state.folderContent}
                    columns={this.columns}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 10 },
                        },
                    }}
                    pageSizeOptions={[10, 25, 50]}
                    checkboxSelection
                />
            </div>
        );
    };
    componentDidMount() {
        this.fetchFoldersDetail(this.props.fid);
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.fid !== this.props.fid) {
            this.fetchFoldersDetail(nextProps.fid);
        }
    }
    render() {
        console.log(this.state.folderContent);
        return (
            <div>
                <this.projectHeader />
                <div style={{ paddingInline: "25px" }}>
                    <this.projectBody />
                    <this.projectTable />
                </div>
                <this.newScanModal />
                <this.createProjectModal />
            </div>
        );
    }
}

export default ProjectFolder;
