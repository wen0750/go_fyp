import * as React from "react";

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

import { experimentalStyled as styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import SigleSelect from "./selector.jsx"
import "./assets/css/editor.css";

const names = ["info", "high", "medium", "critical", "low", "unknown"];
const classification = ["cvss-metrics", "cvss-score", "cve-id", "cwe-id"]

const Item = styled(Button)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1.7),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    border: '3px dashed rgba(0, 0, 0, 0.12)',
    width: 1,
  }));

function TemplateInfo() {
    return (<Card sx={{ my: 3, boxShadow: 3 }}>
        <CardHeader title="Info" />
        <hr />
        <CardContent>
            <Grid container="container" spacing={2} columns={{ xs: 4, sm: 8, md: 12 }}>
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
                    <TextField label="tags" />
                </Grid>
                <Grid item="item">
                    <TextField label="reference (list)" />
                </Grid>
                <Grid item="item" xs={8} sm={8} md={8}>
                    <TextField id="outlined-multiline-static" label="description" multiline="multiline" rows={3} />
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

            </Grid>
            <h3>classification</h3>
            <Box sx={{ flexGrow: 1, borderRadius: '16px', border: 1, boxShadow: 2, p: 3, my: 2 }}>
                <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                    {Array.from(classification).map((value, index) => (
                        <Grid xs={2} sm={4} md={4} key={index}>
                            <TextField label={value} />
                        </Grid>
                    ))}
                    <Grid xs={2} sm={4} md={4} >
                        <Item sx={{minWidth:1}}><AddIcon></AddIcon></Item>
                    </Grid>
                </Grid>
            </Box>
            <Button variant="contained" >Button</Button>
        </CardContent>
    </Card>);
}

function TemplateRequest() {
    return (<Card sx={{ my: 3, boxShadow: 3 }}>
        <CardHeader title="Request" />
        <hr />
        <CardContent>
            <Grid container="container" spacing={2} columns={{ xs: 4, sm: 8, md: 12 }}>
                <Grid item="item">
                    <TextField label="Method" />
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
