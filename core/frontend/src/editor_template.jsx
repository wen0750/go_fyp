import * as React from "react";

import { experimentalStyled as styled } from "@mui/material/styles";

import {
    Card,
    CardHeader,
    CardContent,
    Box,
    TextField,
    Container,
} from "@mui/material";

import Grid from "@mui/material/Unstable_Grid2";
import "./assets/css/editor.css";
import SigleSelect from "./editor_ext_selector";
import FormTableFormat from "./editor_ext_formTableFormat";
import OutlinedButtons from "./editor_ext_moreOptionBtn";

export default class EditorTemplate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            option: "",
        };

        const ITEM_HEIGHT = 40;
        const ITEM_PADDING_TOP = 8;

        this.menuProps = {
            PaperProps: {
                style: {
                    maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                    width: 220,
                },
            },
        };
        this.classification = [
            {
                key: 0,
                label: "cvss-metrics",
                type: "TextField",
                visible: true,
                removable: false,
            },
            {
                key: 1,
                label: "cvss-score",
                type: "TextField",
                visible: true,
                removable: false,
            },
            {
                key: 2,
                label: "cve-id",
                type: "TextField",
                visible: true,
                removable: false,
            },
            {
                key: 3,
                label: "cwe-id",
                type: "TextField",
                visible: true,
                removable: false,
            },
        ];
        this.OptionList = [
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
                value: ["info", "high", "medium", "critical", "low", "unknown"],
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
            {
                key: 6,
                label: "tags",
                type: "TextField",
                visible: false,
                removable: true,
            },
        ];
    }

    PartInformation = () => {
        return (
            <Card sx={{ my: 2 }}>
                <CardHeader title="Information" />
                <hr />
                <CardContent>
                    <Grid
                        container="container"
                        spacing={2}
                        columns={{ xs: 4, sm: 8, md: 12 }}
                    >
                        <FormTableFormat
                            opts={this.OptionList}
                        ></FormTableFormat>
                    </Grid>
                    <h3>classification</h3>
                    <Box
                        sx={{
                            flexGrow: 1,
                            borderRadius: "16px",
                            border: 1,
                            p: 3,
                            my: 2,
                        }}
                    >
                        <Grid
                            container
                            spacing={{ xs: 2, md: 3 }}
                            columns={{ xs: 4, sm: 8, md: 12 }}
                        >
                            <FormTableFormat
                                opts={this.classification}
                            ></FormTableFormat>
                        </Grid>
                    </Box>
                </CardContent>
            </Card>
        );
    };

    PartRequest = () => {
        return (
            <Card sx={{ my: 2 }}>
                <CardHeader title="Request" />
                <hr />
                <CardContent>
                    <Grid
                        container="container"
                        spacing={2}
                        columns={{ xs: 4, sm: 8, md: 12 }}
                    >
                        <Grid item="item" xs={4}>
                            <TextField label="path" />
                        </Grid>
                        <Grid item="item">
                            <TextField label="redirects" />
                        </Grid>
                        <Grid item="item">
                            <TextField label="max-redirects" />
                        </Grid>
                        <Grid item="item">
                            <TextField label="stop-at-first-match" />
                        </Grid>
                        <Grid item="item">
                            <TextField label="headers" />
                        </Grid>
                        <Grid item="item">
                            <TextField label="User-Agent" />
                        </Grid>
                        <Grid item="item">
                            <TextField label="Origin" />
                        </Grid>
                        <Grid item="item">
                            <TextField label="Content-Type" />
                        </Grid>
                        <Grid item="item">
                            <TextField label="cmd" />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        );
    };

    render() {
        return (
            <Container maxWidth="lg">
                {/* <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <this.PartRequest />
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <this.PartRequest />
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <this.ActionButton />
                    </Grid>
                </Grid> */}

                <this.PartInformation />
                <this.PartRequest />
            </Container>
        );
    }
}
