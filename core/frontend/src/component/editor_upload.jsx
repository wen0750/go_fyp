import React, { useState } from "react";
import { experimentalStyled as styled } from "@mui/material/styles";

import { Card, CardHeader, CardContent, Container } from "@mui/material";

import Grid from "@mui/material/Unstable_Grid2";
import "../assets/css/editor.css";

const DropZone = (props) => {
    const [errorMessage, setErrorMessage] = useState("");

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const file = e.dataTransfer.files[0];

        if (
            file &&
            (file.name.endsWith(".yaml") || file.name.endsWith(".js"))
        ) {
            setErrorMessage(""); // Clear error message
            const reader = new FileReader();

            reader.onload = (event) => {
                const fileContent = event.target.result;
                console.log(fileContent);
                // Process the file content here
            };

            reader.readAsText(file);
        } else {
            setErrorMessage(
                "Can't upload. Use an template in one of these formats: .js or .yaml "
            ); // Set error message
        }
    };

    return (
        <div
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
                position: "relative", // Add position: relative
            }}
        >
            {errorMessage && (
                <div
                    style={{
                        position: "absolute", // Add position: absolute
                        borderTopLeftRadius: "10px",
                        borderTopRightRadius: "10px",
                        top: 0,
                        left: 0,
                        right: 0,
                        padding: "10px",
                        backgroundColor: "rgb(255,175,175)",
                        color: "red",
                        textAlign: "center",
                    }}
                >
                    {errorMessage}
                </div>
            )}
            <p>Drag and drop your .yaml or .js file here</p>
        </div>
    );
};

export default class EditorUpload extends React.Component {
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
    }

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

    render() {
        return (
            <Container maxWidth="lg">
                <this.TemplateVariables />
            </Container>
        );
    }
}
