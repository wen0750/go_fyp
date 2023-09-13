import * as React from "react";
import { Link } from "react-router-dom";
import {
    Box,
    Button,
    IconButton,
    Tooltip,
    Typography,
    Modal,
} from "@mui/material";

import Grid from "@mui/material/Grid";
import { Autocomplete, TextField, Stack } from "@mui/material";
import { OutlinedInput, InputAdornment, FormControl } from "@mui/material";

import LoadingButton from "@mui/lab/LoadingButton";
import { DataGrid } from "@mui/x-data-grid";

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
                name: "version",
                schedule: "CVE-2020-26067",
                lastscanned: "2020-8-12 3:12:02",
                tid: "64fbe26d40cbb5017185afe3",
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
            createProjectModalIsOpen: false,
            createFolderModalIsOpen: false,
            modalLoading: false,
            selectedTIDs: [],
            rows: this.rows,
            folderContent: this.rows,
            f_folder_name: "",
            f_project_name: "",
            f_project_host: [],
            f_project_pocs: [],
            f_templates:[],
        };
        this.CreateProjectModalStyle = {
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
        this.columns = [
            {
                field: "name",
                headerName: "Name",
                width: 250,
                minWidth: 150,
                maxWidth: 400,
                renderCell: (params) => this.renderTablePorjectName(params),
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
                field: "status",
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
                                this.handleRemoveProject(this.props.fid,params.row.id)
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
        if (fid.length > 5) {
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
                        console.log("tta1");
                        json[0].project.forEach((item, i) => {
                            item.id = i + 1;
                        });
                        this.setState({ folderContent: json[0].project });
                        return;
                    }
                });
        }
        if (this.state.folderContent !== this.rows) {
            this.setState({ folderContent: this.rows });
        }
    };

    getTemplates = () => {
        // Fetch the templates
        fetch(
            `${globeVar.backendprotocol}://${globeVar.backendhost}/folder/getTemplates`,
            {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())
        .then(data => {
            this.setState({ f_templates: data }); // Update the state with the fetched templates
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.fid !== this.props.fid) {
            this.fetchFoldersDetail(nextProps.fid);
        }
    }

    

    createNewFolder = () => {
        if (this.state.f_folder_name) {
            fetch(
                `${globeVar.backendprotocol}://${globeVar.backendhost}/folder/create`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        name: this.state.f_folder_name,
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
        }
    };

    createNewProject = () => {
        console.log("tttttttttttttttt");
        if (this.state.f_project_name && this.state.f_project_host && this.state.selectedTIDs) {
            console.log("ttttttttttttttttt");
            fetch(
                `${globeVar.backendprotocol}://${globeVar.backendhost}/project/createProject`,
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: this.state.f_project_name,
                        fid: this.props.fid,
                        host: this.state.f_project_host,
                        //poc: this.state.f_project_pocs,
                        poc: this.state.selectedTIDs,
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
        }
    };

    //
    // ┳┳  •    ┳┓   •
    // ┃┃  ┓    ┃┃┏┓┏┓┏┓┏┓
    // ┗┛  ┗    ┻┛┗ ┛┗┗┫┛┗
    //                 ┛
    renderTablePorjectName = (param) => {
        return (
            <Link
                to={"../project/" + param.row.pid}
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                }}
            >
                {param.row.name}
            </Link>
        );
    };
    renderActionButton = (param) => {
        switch (param.row.status) {
            case "scanning":
                return (
                    <div>
                        <Tooltip title="Pause">
                            <IconButton
                                aria-label="take action for this project"
                                onClick={() =>
                                    this.handleAction(param.row.pid, "Pause")
                                }
                            >
                                <PauseIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Stop">
                            <IconButton
                                aria-label="take action for this project"
                                onClick={() =>
                                    this.handleAction(param.row.pid, "Stop")
                                }
                            >
                                <StopIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Rescan">
                            <IconButton
                                aria-label="take action for this project"
                                onClick={() =>
                                    this.handleAction(param.row.pid, "Restart")
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
                                    this.handleAction(param.row.pid, "Resume")
                                }
                            >
                                <PlayArrowIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Stop">
                            <IconButton
                                aria-label="take action for this project"
                                onClick={() =>
                                    this.handleAction(param.row.pid, "Stop")
                                }
                            >
                                <StopIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Rescan">
                            <IconButton
                                aria-label="take action for this project"
                                onClick={() =>
                                    this.handleAction(param.row.pid, "Restart")
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
                                this.handleAction(param.row.pid, "Scan")
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
                                this.handleAction(param.row.pid, "Scan")
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
        console.log(this.state.folderContent);
        const rowIndex = this.state.folderContent.findIndex((object) => {
            return object.pid === id;
        });

        if (rowIndex === -1) return; // If row not found, don't do anything

        // Copy the current state's rows
        const newRows = [...this.state.folderContent];

        // Action control &&
        // Change the action of the row with the given id to "scanning"
        switch (action) {
            case "Scan":
                newRows[rowIndex].status = "scanning";
                // this.projectActionScan(id);
                break;
            case "Pause":
                newRows[rowIndex].status = "paused";
                // this.projectActionPause(id);
                break;
            case "Stop":
                newRows[rowIndex].status = "idle";
                // this.projectActionStop(id);
                break;
            case "Resume":
                newRows[rowIndex].status = "scanning";
                // this.projectActionResume(id);
                break;
            case "Restart":
                newRows[rowIndex].status = "scanning";
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
   
    handleRemoveProject = (fid,rowId) => {
        fetch(
            `${globeVar.backendprotocol}://${globeVar.backendhost}/project/remove`,
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fid: fid,
                    rowId: rowId.toString(),
                }),
            }
        )
        
        console.log(`Remove button clicked for id: ${id}`);
    };

    //   _____
    //  |  __ \
    //  | |__) |__  _ __  _   _ _ __
    //  |  ___/ _ \| '_ \| | | | '_ \
    //  | |  | (_) | |_) | |_| | |_) |
    //  |_|   \___/| .__/ \__,_| .__/
    //             | |         | |
    //             |_|         |_|

    // project
    changeProjectFormInput_name = (e) => {
        this.setState({ f_project_name: e.target.value });
    };
    changeProjectFormInput_host = (d) => {
        this.setState({ f_project_host: d });
    };
    changeProjectFormInput_pocs = (e) => {
        console.log(e.target.value);
        this.setState({ f_project_pocs: e.target.value });
    };

    openCreateProjectModal = () => {
        this.setState({ createProjectModalIsOpen: true });
    };
    closeCreateProjectModal = () => {
        this.setState({ createProjectModalIsOpen: false });
    };

    handleCreateProjectModalSend = () => {
        this.setState({ modalLoading: true });
        this.createNewProject();
        setTimeout(() => {
            this.fetchFoldersDetail(this.props.fid);
            this.setState({ modalLoading: false });
            this.closeCreateProjectModal();
        }, 1000);
    };
    CreateProjectModal = () => {
        var pocs = [];
        pocs = this.rows;
        return (
            <div>
                <Modal
                    open={this.state.createProjectModalIsOpen}
                    onClose={this.closeCreateProjectModal}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={this.CreateProjectModalStyle}>
                        <Typography
                            id="modal-modal-title"
                            variant="h6"
                            component="h2"
                        >
                            Create a New Template
                        </Typography>
                        <Stack spacing={3} sx={{ width: 1, marginBlock: 1 }}>
                            <TextField
                                id="outlined-basic"
                                label="Template_Names"
                                variant="outlined"
                                onChange={this.changeProjectFormInput_name}
                            />
                            <InputTags
                                cbFunc={this.changeProjectFormInput_host}
                            ></InputTags>
                            <Autocomplete
                                multiple
                                id="tags-outlined"
                                options={this.state.f_templates}
                                getOptionLabel={(option) => option.id || "Unnamed Template"}
                                filterSelectedOptions
                                onChange={(event, newValue) => {
                                    console.log(newValue); // log the new value
                                    this.setState({
                                        selectedTIDs: newValue.map(item => item._id)
                                            //.filter((item) => item.tid)
                                            //.map((item) => item.tid),
                                            .filter((item) => item) // Filter out options with no `name` property
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
                                    onClick={this.closeCreateProjectModal}
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
                                <LoadingButton
                                    onClick={this.handleCreateProjectModalSend}
                                    endIcon={<SendIcon />}
                                    loading={this.state.modalLoading}
                                    loadingPosition="end"
                                    variant="contained"
                                >
                                    <span>Send</span>
                                </LoadingButton>
                            </Grid>
                        </Grid>
                    </Box>
                </Modal>
            </div>
        );
    };

    // folder
    changeFolderFormInput_name = (e) => {
        console.log(e.target.value);
        this.setState({ f_folder_name: e.target.value });
    };

    openCreateFolderModal = () => {
        this.setState({ createFolderModalIsOpen: true });
    };
    closeCreateFolderModal = () => {
        this.setState({ createFolderModalIsOpen: false });
    };

    handleCreateFolderModalSend = () => {
        this.setState({ modalLoading: true });
        this.createNewFolder();
        setTimeout(() => {
            this.setState({ modalLoading: false });
            this.closeCreateFolderModal();
        }, 1000);
    };

    createFolderModal = () => {
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
                    <Box sx={this.CreateProjectModalStyle}>
                        <Typography
                            id="modal-modal-title"
                            variant="h6"
                            component="h2"
                        >
                            Create a New Folder
                        </Typography>
                        <Stack spacing={3} sx={{ width: 1, marginBlock: 1 }}>
                            <TextField
                                id="outlined-basic"
                                label="Folder_Names"
                                variant="outlined"
                                onChange={this.changeFolderFormInput_name}
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
                                <LoadingButton
                                    onClick={this.handleCreateFolderModalSend}
                                    endIcon={<SendIcon />}
                                    loading={this.state.modalLoading}
                                    loadingPosition="end"
                                    variant="contained"
                                >
                                    <span>Send</span>
                                </LoadingButton>
                            </Grid>
                        </Grid>
                    </Box>
                </Modal>
            </div>
        );
    };

    //   ____            _
    //  |  _ \          | |
    //  | |_) | ___   __| |_   _
    //  |  _ < / _ \ / _` | | | |
    //  | |_) | (_) | (_| | |_| |
    //  |____/ \___/ \__,_|\__, |
    //                      __/ |
    //                     |___/

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
                            onClick={this.openCreateProjectModal}
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
                    disableRowSelectionOnClick
                />
            </div>
        );
    };

    componentDidMount() {
        this.fetchFoldersDetail(this.props.fid);
        this.getTemplates();
        
    }
    render() {
        console.log(this.state.folderContent);
        console.log(this.state.f_templates);
        return (
            <div>
                <this.projectHeader />
                <div style={{ paddingInline: "25px" }}>
                    <this.projectBody />
                    <this.projectTable />
                </div>
                <this.CreateProjectModal />
                <this.createFolderModal />
            </div>
        );
    }
}

export default ProjectFolder;
