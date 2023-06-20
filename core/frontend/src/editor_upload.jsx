import React, { useState, useEffect } from 'react';

import {
    Card,
    CardHeader,
    CardContent,
    Container,
} from "@mui/material";

import Grid from "@mui/material/Unstable_Grid2";
import "./assets/css/editor.css";


// DropZone for drag and drop file uploads
const DropZone = (props) => {
    const [errorMessage, setErrorMessage] = useState("");
    // Track when a file is being dragged over the drop area
    const [dragging, setDragging] = useState(false);
    //storing uploaded files
    const [uploadedFiles, setUploadedFiles] = useState([]);

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Set dragging state to true when a file enters the drop area
        setDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Set dragging state to false when a file leaves the drop area
        setDragging(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);
        const file = e.dataTransfer.files[0];

        // Check if file is .yaml or .js file
        if (file && (file.name.endsWith('.yaml') || file.name.endsWith('.js'))) {
            setErrorMessage(""); // Clear error message
            const reader = new FileReader();

            reader.onload = (event) => {
                const fileContent = event.target.result;
                console.log(fileContent);
                // Store uploaded file
                setUploadedFiles([...uploadedFiles, { name: file.name, content: fileContent }]);
            };

            reader.readAsText(file);
        } else {
            // Error Message
            setErrorMessage("Can't upload. Use an template in one of these formats: .js or .yaml "); // Set error message
        }
    }; 

    // Style for the drop area when a file is being dragged over it
    const draggingStyle = {
        backgroundColor: "#e0e0e0",
        borderColor: "#3f51b5",
    };

    return (
        <div>
            <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                style={{
                    border: "2px dashed #ccc",
                    borderRadius: "10px",
                    padding: "20px",
                    textAlign: "center",
                    marginBottom: "20px",
                    height: "200px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    transition: "all 0.3s",
                    ...(dragging ? draggingStyle : {}),
                }}
            >
                {errorMessage && (
                    <div
                        style={{
                            position: "absolute",
                            borderTopLeftRadius: "10px",
                            borderTopRightRadius: "10px",
                            top: 0,
                            left: 0,
                            right: 0,
                            padding: "10px",
                            backgroundColor: "rgb(255,175,175)",
                            color: "red",
                            textAlign: "center",
                            transition: "all 0.9s",
                        }}
                    >
                        {errorMessage}
                    </div>
                )}
                <p>Drag and drop your .yaml or .js file here</p>
            </div>
            <div>
                <h3>Uploaded Files:</h3>
                <ul>
                    {uploadedFiles.map((file, index) => (
                        <li key={index}>{file.name}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

// Upload component wrapping the DropZone component
export default class Upload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            option: "",
        };

        const ITEM_HEIGHT = 0;
        const ITEM_PADDING_TOP = 8;

        this.menuProps = {
            PaperProps: {
                style: {
                    maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                    width: 220,
                },
            },
        };
    }
    // This a styled Card component containing the DropZone
    TemplateVariables = () => {
        return (
            <Card>
                <CardHeader title="+ Variables" />
                <hr />
                <CardContent>
                    <DropZone />
                    <Grid
                        container="container"
                        spacing={2}
                        columns={{ xs: 4, sm: 8, md: 12 }}
                    >
                    </Grid>
                </CardContent>
            </Card>
        );
    };

    // Render method for the Upload component
    render() {
        return (
            <Container maxWidth="lg">
                <this.TemplateVariables />
            </Container>
        );
    }
}
