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

import "./assets/css/editor.css";
import SigleSelect from "./selector.jsx"

import { experimentalStyled as styled } from '@mui/material/styles';

import Grid from '@mui/material/Unstable_Grid2';

const names = [
    "info", "high", "medium", "critical", "low", "unknown"
];

const classification = ["cvss-metrics", "cvss-score", "cve-id", "cwe-id"]

function ondatasubmit () {

    fetch('http://192.168.0.104:8888/editor', {
        method: 'POST',
        body: JSON.stringify({
            id:"",info:{
                name:"ssss",
                author:"bbb"
            }
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
      .then((response) => {
        if (response.ok) {
            // If the response is successful, trigger a download of the file
            response.blob().then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = "test.yaml";
                const button = document.createElement('button');
                button.textContent = "Download YAML";
                button.addEventListener('click', () => {
                    a.click();
                });
                document.body.appendChild(button);
            });
        } else {
            console.log('Server responded with an error');
        }
    })
    .catch((err) => {
        console.log(err.message);
    });


             {/*a.download = "test.yaml";
                a.click();
            });
        } else {
            console.log('Server responded with an error');
        }
    })
    .catch((err) => {
        console.log(err.message);
    });



      
         .then((response) => response.json())
         .then((data) => {
            console.log(data);
            // Handle data
         })
         .catch((err) => {
            console.log(err.message);
         });This is a JSX comment */} 
}


function TemplateInfo() {
    return (<Card>
        <CardHeader title="Template" />
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
                    <TextField required="required" id="outlined-required" label="Required" defaultValue="Hello World" />
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
                <Grid item="item">
                    <TextField label="tags" />
                </Grid>
            </Grid>
            <h3>classification</h3>
            <Box sx={{ flexGrow: 1, borderRadius: '16px', border: 1, p: 3, my: 2 }}>
                <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                    {Array.from(classification).map((value, index) => (
                        <Grid xs={2} sm={4} md={4} key={index}>
                            <TextField label={value} />
                        </Grid>
                    ))}
                </Grid>
            </Box>
            <Button variant="contained" onClick={ondatasubmit}></Button>
        </CardContent>
    </Card>);
}

function TemplateRequest() {
    return (<Card>
        <CardHeader title="Template" />
        <hr />
        <CardContent>
            <Grid container="container" spacing={2} columns={{ xs: 4, sm: 8, md: 12 }}>
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
