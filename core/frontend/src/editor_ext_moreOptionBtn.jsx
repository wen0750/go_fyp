import * as React from "react";
import { styled } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import TagFacesIcon from "@mui/icons-material/TagFaces";

const ListItem = styled("li")(({ theme }) => ({
    margin: theme.spacing(0.5),
}));

export default function ChipsArray() {
    const [chipData, setChipData] = React.useState([
        {
            key: 0,
            label: "Name",
            type: "textinput",
            display: "true",
            removable: "false",
        },
        {
            key: 1,
            label: "Name",
            type: "textinput",
            display: "true",
            removable: "false",
        },
        {
            key: 2,
            label: "Author",
            type: "textinput",
            display: "true",
            removable: "false",
        },
        {
            key: 3,
            label: "Risk Level",
            type: "SigleSelect",
            display: "true",
            removable: "false",
        },
        {
            key: 4,
            label: "Reference",
            type: "textinput",
            display: "true",
            removable: "false",
        },
        {
            key: 5,
            label: "Description",
            type: "multiline",
            display: "true",
            removable: "false",
        },
        {
            key: 6,
            label: "Remediation",
            type: "textinput",
            display: "true",
            removable: "false",
        },
        {
            key: 7,
            label: "Verification",
            type: "textinput",
            display: "true",
            removable: "false",
        },
        {
            key: 8,
            label: "Risk Level",
            type: "textinput",
            display: "true",
            removable: "false",
        },
        {
            key: 9,
            label: "Reference",
            type: "textinput",
            display: "true",
            removable: "false",
        },
        {
            key: 10,
            label: "React",
            type: "textinput",
            display: "true",
            removable: "false",
        },
    ]);

    const handleDelete = (chipToDelete) => () => {
        setChipData((chips) =>
            chips.filter((chip) => chip.key !== chipToDelete.key)
        );
    };

    return (
        <Paper
            sx={{
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap",
                listStyle: "none",
                p: 0.5,
                m: 0,
            }}
            component="ul"
        >
            {chipData.map((data) => {
                let icon;

                return <Grid key={data.key}></Grid>;
            })}
        </Paper>
    );
}
