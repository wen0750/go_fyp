import * as React from "react";

import { experimentalStyled as styled } from "@mui/material/styles";

import {
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Typography,
    Button,
    Box,
    TextField,
    Container,
} from "@mui/material";

import Grid from "@mui/material/Unstable_Grid2";
import "./assets/css/editor.css";
import SigleSelect from "./editor_ext_selector";
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
        this.names = ["info", "high", "medium", "critical", "low", "unknown"];
        this.classification = [
            "cvss-metrics",
            "cvss-score",
            "cve-id",
            "cwe-id",
        ];
    }

    PartInformation = () => {
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
                        <Grid item="item">
                            <TextField required="required" label="name" />
                        </Grid>
                        <Grid item="item">
                            <TextField label="author" />
                        </Grid>
                        <Grid item="item" xs={2.3}>
                            <SigleSelect
                                list={this.names}
                                label="Risk Level"
                            ></SigleSelect>
                        </Grid>
                        <Grid item="item">
                            <TextField
                                required="required"
                                id="outlined-required"
                                label="Required"
                                defaultValue="Hello World"
                            />
                        </Grid>
                        <Grid item="item">
                            <TextField label="reference (list)" />
                        </Grid>
                        <Grid item="item" xs={8} sm={8} md={8}>
                            <TextField
                                id="outlined-multiline-static"
                                label="description"
                                multiline="multiline"
                                rows={3}
                            />
                        </Grid>

                        <Grid item="item">
                            <TextField label="remediation" />
                        </Grid>
                        <Grid item="item">
                            <TextField label="verified" />
                        </Grid>
                        <Grid item="item">
                            <TextField label="fofa-query" />
                        </Grid>
                        <Grid item="item">
                            <TextField label="shodan-query" />
                        </Grid>
                        <Grid item="item">
                            <TextField label="google-query" />
                        </Grid>
                        <Grid item="item">
                            <TextField label="tags" />
                        </Grid>
                        <Grid item="item">
                            <OutlinedButtons />
                        </Grid>
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
                            {Array.from(this.classification).map(
                                (value, index) => (
                                    <Grid xs={2} sm={4} md={4} key={index}>
                                        <TextField label={value} />
                                    </Grid>
                                )
                            )}
                        </Grid>
                    </Box>
                </CardContent>
            </Card>
        );
    };

    PartRequest = () => {
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
                        <Grid item="item" xs={4}>
                            <TextField label="path" />
                        </Grid>
                        <Grid item="item">
                            <TextField label="author" />
                        </Grid>
                        <Grid item="item">
                            <TextField label="author" />
                        </Grid>
                        <Grid item="item">
                            <TextField label="author" />
                        </Grid>
                        <Grid item="item">
                            <TextField label="author" />
                        </Grid>
                        <Grid item="item">
                            <TextField label="author" />
                        </Grid>
                        <Grid item="item">
                            <TextField label="author" />
                        </Grid>
                        <Grid item="item">
                            <TextField label="author" />
                        </Grid>
                        <Grid item="item">
                            <TextField label="author" />
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
