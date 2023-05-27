import * as React from "react";
import { styled } from "@mui/material/styles";
import {
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Typography,
    Button,
    Box,
    Grid,
    TextField,
    Container,
} from "@mui/material";

import SigleSelect from "./editor_ext_selector";

const ListItem = styled("li")(({ theme }) => ({
    margin: theme.spacing(0.5),
}));

const names = ["info", "high", "medium", "critical", "low", "unknown"];

const OptionList = [
    {
        key: 0,
        label: "Name",
        type: "TextField",
        visible: true,
        removable: false,
    },
    {
        key: 1,
        label: "Author",
        type: "TextField",
        visible: true,
        removable: false,
    },
    {
        key: 2,
        label: "Risk Level",
        type: "SigleSelect",
        visible: true,
        removable: false,
    },
    {
        key: 3,
        label: "reference",
        type: "TextField",
        visible: true,
        removable: false,
    },
    {
        key: 4,
        label: "remediation",
        type: "multiline",
        visible: true,
        removable: false,
    },
    {
        key: 5,
        label: "verified",
        type: "TextField",
        visible: false,
        removable: true,
    },
];

export default function ChipsArray() {
    const [chipData, setChipData] = React.useState(OptionList);

    const handleDelete = (chipToDelete) => () => {
        setChipData((chips) =>
            chips.filter((chip) => chip.key !== chipToDelete.key)
        );
    };

    return (
        <Card sx={{ my: 2 }}>
            <CardHeader title="Template" />
            <hr />
            <CardContent>
                <Grid
                    container="container"
                    spacing={2}
                    columns={{ xs: 4, sm: 8, md: 12 }}
                >
                    {chipData.map((data) => {
                        return (() => {
                            if (data.visible === true) {
                                let element;
                                if (data.type === "TextField") {
                                    element = <TextField label={data.label} />;
                                } else if (data.type === "SigleSelect") {
                                    element = (
                                        <SigleSelect
                                            list={names}
                                            label={data.label}
                                        />
                                    );
                                } else if (data.type === "multiline") {
                                    element = (
                                        <TextField
                                            label={data.label}
                                            multiline="multiline"
                                            rows={3}
                                        />
                                    );
                                }
                                return (
                                    <Grid
                                        key={data.key}
                                        style={{ width: "222.4px" }}
                                    >
                                        {element}
                                    </Grid>
                                );
                            }
                        })();
                    })}
                </Grid>
            </CardContent>
        </Card>
    );
}
