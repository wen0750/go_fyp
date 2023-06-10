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

import SigleSelect from "./selector.jsx";

import { experimentalStyled as styled } from "@mui/material/styles";

import Grid from "@mui/material/Unstable_Grid2";
import Upload from "./editor_upload";

const names = ["info", "high", "medium", "critical", "low", "unknown"];

const classification = ["cvss-metrics", "cvss-score", "cve-id", "cwe-id"];

// Serve the YAML to user
function ondatasubmit() {
    //change ip & port, should be set to server-side IP
    //this is hard-coded
    fetch("http://127.0.0.1:8888/editor/download", {
        method: "POST",
        body: JSON.stringify({
            ID: "Test",
            Info: {
                Name: "abc",
                Author: "FYP",
            },
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        },
    })
        .then((response) => {
            if (response.ok) {
                // If the response is successful, create a button to download file
                response.blob().then((blob) => {
                    // Trigger the download directly
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "test.yaml";
                    a.style.display = "none";
                    document.body.appendChild(a);
                    a.click(); // Trigger the download
                    document.body.removeChild(a); // Clean up the link element
                });
            } else {
                console.log("Server responded with an error");
            }
        })
        .catch((err) => {
            console.log(err.message);
        });
}

//After the user clicks it, it will return the uid to user for later searching(find his own YAML)
function SaveToMongo() {
    //change ip & port, should be set to server-side IP
    //this is hard-coded
    fetch("http://127.0.0.1:8888/editor/save", {
        method: "POST",
        body: JSON.stringify({
            ID: "Test12",
            Info: {
                Name: "Test1",
                Author: "Test2",
                Severity: "Test",
                Reference: ["Test1", "Test2", "Test3"],
            },
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        },
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else if (response.status === 409) {
                throw new Error("Duplicate entry");
            } else {
                console.log("Server responded with an error");
                throw new Error("Server Error");
            }
        })
        .then((data) => {
            console.log("Action:", data.action);
            console.log("Inserted ID:", data.id);

            let title;
            let htmlContent;
            if (data.action === "created") {
                title = "Template Created Successfully";
                htmlContent =
                    "<strong>UID:</strong> " +
                    data.id +
                    "<br>" +
                    "This is the <strong>UID</strong> in the Database, you can save it for later search";
            } else {
                title = "Template Updated Successfully";
                htmlContent =
                    "<strong>Template Name:</strong> " +
                    data.id +
                    "<br>" +
                    "It is updated in the Database, you can check it anytime";
            }

            // Show a message box to let the user know the Inserted ID
            Swal.fire({
                title: title,
                html: htmlContent,
                icon: "success",
            });
        })
        .catch((error) => {
            console.error("Error:", error);

            if (error.message === "Duplicate entry") {
                // Display a failure message box for duplicate entry
                Swal.fire({
                    title: "ID Duplicated in Database",
                    text: "A template with this ID already exists. Please try again with a different Name.",
                    icon: "error",
                });
            } else {
            }
        });
}

function GetDataFromMongoDB() {
    const [data, setData] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const response = await fetch("http://localhost:8000/data");
            const data = await response.json();
            setData(data);
        }
        fetchData();
    }, []);

    return (
        <div>
            {data &&
                data.map((item, index) => (
                    <div key={index}>
                        <p>{id}</p>
                        <p>{info.name}</p>
                    </div>
                ))}
        </div>
    );
}

function TemplateInfo() {
    return (
        <Card>
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
                            list={names}
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
                        {Array.from(classification).map((value, index) => (
                            <Grid xs={2} sm={4} md={4} key={index}>
                                <TextField label={value} />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </CardContent>
        </Card>
    );
}

function TemplateRequest() {
    return (
        <Card>
            <CardHeader title="Template" />
            <hr />
            <CardContent>
                <Grid
                    container="container"
                    spacing={2}
                    columns={{ xs: 4, sm: 8, md: 12 }}
                >
                    <Grid item="item"></Grid>
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
}

function TemplateWorkflows() {
    return (
        <Card>
            <CardHeader title="+ Workflows" />
            <hr />
            <CardContent>
                <Grid
                    container="container"
                    spacing={2}
                    columns={{ xs: 4, sm: 8, md: 12 }}
                >
                    <Grid item="item"></Grid>
                    <Grid item="item" xs={4}>
                        <TextField label="+ Template" />
                    </Grid>
                    <Grid item="item">
                        <TextField label="+ Subtemplates" />
                    </Grid>
                    <Grid item="item">
                        <TextField label="+ matchers" />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}

function TemplateVariables() {
    return (
        <Card>
            <CardHeader title="+ Variables" />
            <hr />
            <CardContent>
                <Grid
                    container="container"
                    spacing={2}
                    columns={{ xs: 4, sm: 8, md: 12 }}
                >
                    <Grid item="item"></Grid>
                    <Grid item="item" xs={4}>
                        <TextField label="+ a1" />
                    </Grid>
                    <Grid item="item">
                        <TextField label="+ a2" />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}

function ButtonSizes() {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "flex-end",
                "& button": { m: 1 },
            }}
        >
            <div>
                <Button variant="contained" size="medium">
                    Import
                </Button>
                <Button variant="contained" size="medium">
                    Clear
                </Button>
                <Button variant="contained" onClick={SaveToMongo} size="medium">
                    save to database
                </Button>
                <Button
                    variant="contained"
                    onClick={ondatasubmit}
                    size="medium"
                >
                    Download
                </Button>
            </div>
        </Box>
    );
}

function Editor() {
    return (
        <Container maxWidth="lg">
            <TemplateInfo />
            <TemplateRequest />
            <TemplateWorkflows />
            <TemplateVariables />
            <Upload />
            <ButtonSizes />
        </Container>
    );
}

export default Editor;
