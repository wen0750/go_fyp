import * as React from "react";

import {
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Typography,
    Button,
    Grid,
    TextField,
    Container,
} from "@mui/material";

import "./assets/css/editor.css";
import SigleSelect from "./selector.jsx"

const names = [
    'Oliver Hansen',
    'Van Henry',
    'April Tucker',
    'Ralph Hubbard',
    'Omar Alexander',
    'Carlos Abbott',
    'Miriam Wagner',
    'Bradley Wilkerson',
    'Virginia Andrews',
    'Kelly Snyder',
];


function TemplateInfo() {
    return (<Card>
        <CardHeader title="Template" />
        <hr />
        <CardContent>
            <Grid container="container" spacing={2} columns={{
                xs: 4,
                sm: 8,
                md: 12
            }}>
                <Grid item="item">
                    <TextField required="required" label="name" />
                </Grid>
                <Grid item="item">
                    <TextField label="author" />
                </Grid>
                <Grid item="item" xs={2.3}>
                    <SigleSelect list={names} label="Risk Level"></SigleSelect>
                </Grid>
                <Grid item="item">
                    <TextField required="required" id="outlined-required" label="Required" defaultValue="Hello World" />
                </Grid>
                <Grid item="item">
                    <TextField label="reference (list)" />
                </Grid>
                <Grid item="item">
                    <TextField label="cvss-metrics" />
                </Grid>
                <Grid item="item" xs={8} sm={8} md={8}>
                    <TextField id="outlined-multiline-static" label="description" multiline="multiline" rows={3} />
                </Grid>
                <Grid item="item">
                    <TextField label="cvss-score" />
                </Grid>
                <Grid item="item">
                    <TextField label="cve-id" />
                </Grid>
                <Grid item="item">
                    <TextField label="cwe-id" />
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
            </Grid>
        </CardContent>
    </Card>);
}

function TemplateRequest() {
    return (<Card>
        <CardHeader title="Template" />
        <hr />
        <CardContent>
            <Grid container="container" spacing={2} columns={{
                xs: 4,
                sm: 8,
                md: 12
            }}>
                <Grid item="item">
                </Grid>
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
    </Card>);
}

function Editor() {
    return (<Container maxWidth="lg">
        <TemplateInfo />
        <TemplateRequest />
    </Container>);
}

export default Editor;
