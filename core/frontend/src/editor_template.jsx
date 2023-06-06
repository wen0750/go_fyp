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
import FormTableFormat from "./editor_ext_formTableFormat";

export default class EditorTemplate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            option: "",
            FormData: {},
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
        this.changeFormData = (catalog, name, value) => {
            if (catalog in this.state.FormData) {
                let newdata = this.state.FormData;
                newdata[catalog][name] = value;
                this.setState({ FormData: newdata });
            } else {
                let newdata = this.state.FormData;
                newdata[catalog] = {};
                newdata[catalog][name] = value;
                this.setState({ FormData: newdata });
            }
            this.props.dataChange(this.state.FormData);
            console.log(this.state.FormData);
        };
        this.classificationOptionList = [
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
        this.infoOptionList = [
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
                label: "Risk-Level",
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
        this.requestOptionList = [
            {
                key: 0,
                label: "path",
                type: "TextField",
                visible: true,
                removable: false,
            },
            {
                key: 1,
                label: "redirects",
                type: "TextField",
                visible: true,
                removable: false,
            },
            {
                key: 2,
                label: "max-redirects",
                type: "TextField",
                visible: true,
                removable: false,
            },
            {
                key: 3,
                label: "stop-at-first-match",
                type: "TextField",
                visible: true,
                removable: false,
            },
            {
                key: 4,
                label: "headers",
                type: "TextField",
                visible: true,
                removable: false,
            },
            {
                key: 5,
                label: "User-Agent",
                type: "TextField",
                visible: true,
                removable: false,
            },
            {
                key: 6,
                label: "Origin",
                type: "TextField",
                visible: true,
                removable: false,
            },
            {
                key: 7,
                label: "Content-Type",
                type: "TextField",
                visible: true,
                removable: false,
            },
            {
                key: 8,
                label: "cmd",
                type: "TextField",
                visible: true,
                removable: false,
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
                            catalog="information"
                            opts={this.infoOptionList}
                            callback={this.changeFormData}
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
                                catalog="classification"
                                opts={this.classificationOptionList}
                                callback={this.changeFormData}
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
                        <FormTableFormat
                            catalog="request"
                            opts={this.requestOptionList}
                            callback={this.changeFormData}
                        ></FormTableFormat>
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
