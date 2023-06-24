import React, { useState, useEffect } from 'react';

import { Card, CardHeader, CardContent, Container } from "@mui/material";

import Grid from "@mui/material/Unstable_Grid2";
import "../assets/css/editor.css";

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
            setErrorMessage(
                "Can't upload. Use an template in one of these formats: .js or .yaml "
            ); // Set error message
        }
    };


    const handleSubmit = (file) => {
        console.log("Submitting files:", uploadedFiles);
        saveToMongo(); // Call the saveToMongo function here
        FileSubmit(); // Call the FileSubmit function here
    };

    // Style for the drop area when a file is being dragged over it
    const draggingStyle = {
        backgroundColor: "#e0e0e0",
        borderColor: "#3f51b5",
    };


    
    const saveToMongo = () => {
        //change ip & port, should be set to server-side IP
        //this is hard-coded
        console.log(props.input);
        fetch("http://127.0.0.1:8888/editor/save", {
          method: "POST",
          body: JSON.stringify({
            id: "Test12",
            info: props.input.information,
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
                        <li key={index}>{file.name}
                        <button onClick={handleSubmit}>Submit</button></li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default class EditorUpload extends React.Component {
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
                    ></Grid>
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
