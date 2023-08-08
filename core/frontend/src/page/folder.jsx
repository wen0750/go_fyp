import * as React from "react";
import { Box, Button, Typography, Modal } from "@mui/material";
import { Chip, Autocomplete, TextField, Stack } from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";
import Grid from "@mui/material/Grid";
import { OutlinedInput, InputAdornment, FormControl } from "@mui/material";

import { FolderHeader } from "../component/page_style/folder_style";
import InputTags from "../component/ext_chips_input";

import ControlPointRoundedIcon from "@mui/icons-material/ControlPointRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";

class ProjectFolder extends React.Component {
    constructor(props) {
        super(props);
        this.state = { newScanModalIsOpen: false };
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
        this.columns = [
            {
                field: "firstName",
                headerName: "Name",
                width: 250,
                minWidth: 150,
                maxWidth: 400,
            },
            {
                field: "lastName",
                headerName: "Schedule",
                width: 250,
                minWidth: 150,
                maxWidth: 400,
            },
            {
                field: "age",
                headerName: "Last Scanned",
                width: 250,
                minWidth: 150,
                maxWidth: 400,
            },
            {
                field: "fullName",
                headerName: "Action",
                sortable: false,
                width: 100,
                minWidth: 50,
                maxWidth: 200,
                valueGetter: (params) =>
                    `${params.row.firstName || ""} ${
                        params.row.lastName || ""
                    }`,
            },
            {
                field: "lastName",
                headerName: "Remove",
                sortable: false,
                width: 100,
                minWidth: 50,
                maxWidth: 200,
                valueGetter: (params) =>
                    `${params.row.firstName || ""} ${
                        params.row.lastName || ""
                    }`,
            },
        ];
    }

    rows = [
        {
            id: 1,
            lastName: "CVE-2020-26067",
            firstName: "CVE-2020-26067",
            age: "2020-8-12 3:12:02",
        },
        {
            id: 2,
            lastName: "CVE-2021-26119",
            firstName: "CVE-2021-26119",
            age: "2021-5-04 12:03:18",
        },
        {
            id: 3,
            lastName: "api_endpoints",
            firstName: "api_endpoints",
            age: "2020-3-24 9:35:23",
        },
        {
            id: 4,
            lastName: "CVE-2017-7504",
            firstName: "CVE-2017-7504",
            age: "2017-8-26 1:25:09",
        },
        {
            id: 5,
            lastName: "CVE-2017-12636",
            firstName: "CVE-2017-12636",
            age: "2017-11-04 3:47:06",
        },
        {
            id: 6,
            lastName: "CVE-2020-1147",
            firstName: "CVE-2020-1147",
            age: "2020-1-9 11:17:11",
        },
        {
            id: 7,
            lastName: "CVE-2021-22123",
            firstName: "CVE-2021-22123",
            age: "2021-9-19 2:53:20",
        },
        {
            id: 8,
            lastName: "CVE-2021-36580",
            firstName: "CVE-2021-36580",
            age: "2021-6-8 8:43:03",
        },
        {
            id: 9,
            lastName: "CVE-2022-23642",
            firstName: "CVE-2022-23642",
            age: "2022-3-14 2:08:16",
        },
    ];

    openNewScanModal = () => {
        this.setState({ newScanModalIsOpen: true });
    };

    closeNewScanModal = () => {
        this.setState({ newScanModalIsOpen: false });
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
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Select POCs of this project"
                                        placeholder="POCs"
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
                        <Button variant="outlined" sx={{ mx: 1 }}>
                            New Folder
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<ControlPointRoundedIcon />}
                            onClick={this.openNewScanModal}
                            sx={{ mx: 1 }}
                        >
                            New Scan
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
                <this.projectHeader />
                <div style={{ paddingInline: "25px" }}>
                    <this.projectBody />
                    <this.projectTable />
                </div>
                <this.newScanModal />
            </div>
        );
    }
}

export default ProjectFolder;
