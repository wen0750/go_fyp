import * as React from "react";
import { Button, Box, Container } from "@mui/material";
import "../assets/css/editor.css";

export default class EditorAction extends React.Component {
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

    FileUploadPage = () => {
        const [selectedFile, setSelectedFile] = useState();
        const [isFilePicked, setIsFilePicked] = useState(false);

        const changeHandler = (event) => {
            setSelectedFile(event.target.files[0]);
            setIsSelected(true);
        };

        const handleSubmission = () => {};
    };

    ondatasubmit = () => {
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
    };

    saveToMongo = () => {
        //change ip & port, should be set to server-side IP
        //this is hard-coded
        console.log(this.props.input);
        fetch("http://127.0.0.1:8888/editor/save", {
            method: "POST",
            body: JSON.stringify({
                id: "Test12",
                info: this.props.input.information,
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
    };

    render() {
        return (
            <Container maxWidth="lg">
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        "& button": { m: 1 },
                    }}
                >
                    <div>
                        <Button
                            variant="contained"
                            component="label"
                            size="medium"
                        >
                            Import
                            <input type="file" hidden />
                        </Button>
                        <Button variant="contained" size="medium">
                            Clear
                        </Button>
                        <Button
                            variant="contained"
                            onClick={this.saveToMongo}
                            size="medium"
                        >
                            Save To Database
                        </Button>
                        <Button
                            variant="contained"
                            onClick={this.ondatasubmit}
                            size="medium"
                        >
                            Download
                        </Button>
                    </div>
                </Box>
            </Container>
        );
    }
}
