import * as React from "react";
import Modal from 'react-modal';
import Popover from 'react-popover';
import { Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";

import { FolderHeader } from "../component/page_style/folder_style";

import ControlPointRoundedIcon from "@mui/icons-material/ControlPointRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

function ProjectHeader({openModal}) {
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
                        sx={{ mx: 1 }}
                        onClick={openModal}
                    >
                        New Scan
                    </Button>
                </div>
            </FolderHeader>
        </Box>
    );
}

function ProjectBody() {
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
}

function ProjectTable({rows, columns}) {
    return (
        <div style={{ height: "100%", width: "100%" }}>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5, 10]}
                checkboxSelection
            />
        </div>
    );
}

class ProjectFolder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalIsOpen: false
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

        this.rows = [
            {
                id: 1,
                lastName: "sam",
                firstName: "sam",
                age: "2020-8-12 3:12:02",
                tid: "64b8f5bb922b684322bd3e81"
            },
            {
                id: 2,
                lastName: "CVE-2021-26119",
                firstName: "CVE-2021-26119",
                age: "2021-5-04 12:03:18",
                tid: "2"
            },
            {
                id: 3,
                lastName: "api_endpoints",
                firstName: "api_endpoints",
                age: "2020-3-24 9:35:23",
                tid: "3"
            },
            {
                id: 4,
                lastName: "CVE-2017-7504",
                firstName: "CVE-2017-7504",
                age: "2017-8-26 1:25:09",
                tid: "4"
            },
            {
                id: 5,
                lastName: "CVE-2017-12636",
                firstName: "CVE-2017-12636",
                age: "2017-11-04 3:47:06",
                tid: "5"
            },
            {
                id: 6,
                lastName: "CVE-2020-1147",
                firstName: "CVE-2020-1147",
                age: "2020-1-9 11:17:11",
                tid: "6"
            },
            {
                id: 7,
                lastName: "CVE-2021-22123",
                firstName: "CVE-2021-22123",
                age: "2021-9-19 2:53:20",
                tid: "7"
            },
            {
                id: 8,
                lastName: "CVE-2021-36580",
                firstName: "CVE-2021-36580",
                age: "2021-6-8 8:43:03",
                tid: "8"
            },
            {
                id: 9,
                lastName: "CVE-2022-23642",
                firstName: "CVE-2022-23642",
                age: "2022-3-14 2:08:16",
                tid: "9"
            },
        ];

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    openModal() {
        this.setState({modalIsOpen: true});
    }

    closeModal() {
        this.setState({modalIsOpen: false});
    }
    
    render() {
        return (
            <div>
                <ProjectHeader openModal={this.openModal} />
                <div style={{ paddingInline: "25px" }}>
                    <ProjectBody />
                    <ProjectTable rows={this.rows} columns={this.columns} />
                </div>
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.closeModal}
                    contentLabel="New Scan Dialog"
                    ariaHideApp={false}
                >
                    <h2>New Scan</h2>
                    <button onClick={this.closeModal}>close</button>
                    <div>I am a modal for the New Scan action.</div>
                </Modal>
            </div>
        );
    }

}

export default ProjectFolder;
