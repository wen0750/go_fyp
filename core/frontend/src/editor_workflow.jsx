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

export default class EditorWorkflow extends React.Component {
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

    TemplateWorkflows = () => {
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
    };
    render() {
        return (
            <Container maxWidth="lg">
                <this.TemplateWorkflows />
            </Container>
        );
    }
}
