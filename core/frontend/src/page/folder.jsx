import * as React from "react";
import { Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";

import { FolderHeader } from "../component/page_style/folder_style";

import ControlPointRoundedIcon from "@mui/icons-material/ControlPointRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

class ProjectFolder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
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
            lastName: "Snow",
            firstName: "Jon",
            age: "2019-12-04 13:22:06",
        },
        {
            id: 2,
            lastName: "Lannister",
            firstName: "Cersei",
            age: "2019-12-04 13:22:06",
        },
        {
            id: 3,
            lastName: "Lannister",
            firstName: "Jaime",
            age: "2019-12-04 13:22:06",
        },
        {
            id: 4,
            lastName: "Stark",
            firstName: "Arya",
            age: "2019-12-04 13:22:06",
        },
        {
            id: 5,
            lastName: "Targaryen",
            firstName: "Daenerys",
            age: "2019-12-04 13:22:06",
        },
        {
            id: 6,
            lastName: "Melisandre",
            firstName: "Melisandre",
            age: "2019-12-04 13:22:06",
        },
        {
            id: 7,
            lastName: "Clifford",
            firstName: "Ferrara",
            age: "2019-12-04 13:22:06",
        },
        {
            id: 8,
            lastName: "Frances",
            firstName: "Rossini",
            age: "2019-12-04 13:22:06",
        },
        {
            id: 9,
            lastName: "Roxie",
            firstName: "Harvey",
            age: "2019-12-04 13:22:06",
        },
    ];

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
            </div>
        );
    }
}

export default ProjectFolder;
