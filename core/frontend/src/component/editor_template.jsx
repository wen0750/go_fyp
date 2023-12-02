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
import "../assets/css/editor.css";
import FormTableFormat from "./editor_ext_formTableFormat";
import EditorAction from "../component/editor_action";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import { MuiChipsInput } from 'mui-chips-input'

import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";



export default class EditorTemplate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            option: "",
            FormData: {},
            responseViwerType: 1,
        };

        const ITEM_HEIGHT = 40;
        const ITEM_PADDING_TOP = 8;

        this.MyComponent = () => {
            const [chips, setChips] = React.useState([])
          
            const handleChange = (newChips) => {
              setChips(newChips)
            }
          
            return (
              <MuiChipsInput value={chips} onChange={handleChange} />
            )
        }

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
                type: "CVE",
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
        this.infomationList = [
            {
                key: 0,
                label: "name",
                type: "TextField",
                visible: true,
                removable: false,
            },
            {
                key: 1,
                label: "author",
                type: "TextField",
                visible: true,
                removable: false,
            },
            {
                key: 2,
                label: "severity",
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
                label: "tags",
                type: "TextField", //Tags
                visible: true,
                removable: false,
            },
        ];
        this.infoOptionList = [
            {
                key: 0,
                label: "Method(Auto)",
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
                            opts={this.infomationList}
                        ></FormTableFormat>
                    </Grid>
                </CardContent>
            </Card>
        );
    };

    Partclassification= () => {
        return (
            <Card sx={{ my: 2 }}>
                <CardHeader title="Classification" />
                <hr />
                <CardContent>
                        <Grid
                            container="container"
                            spacing={2}
                            columns={{ xs: 4, sm: 8, md: 12 }}
                        >
                            <FormTableFormat
                                catalog="classification"
                                opts={this.classificationOptionList}
                            ></FormTableFormat>
                        </Grid>
                </CardContent>
            </Card>
        );
    };

    PartTags = () => {
        return (
            <Card sx={{ my: 2 }}>
                <CardHeader title="Tags" />
                <hr />
                <CardContent>
                    <Grid
                        container="container"
                        spacing={2}
                        columns={{ xs: 4, sm: 8, md: 12 }}
                    ></Grid>
                    <this.MyComponent/>
                </CardContent>
            </Card>
        );
    };

    PartOptions= () => {
        return (
            <Card sx={{ my: 2 }}>
                <CardHeader title="Options" />
                <hr />
                <CardContent>
                        <Grid
                            container="container"
                            spacing={2}
                            columns={{ xs: 4, sm: 8, md: 12 }}
                        >
                            <FormTableFormat
                                catalog="Options"
                                opts={this.infoOptionList}
                            ></FormTableFormat>
                        </Grid>
                </CardContent>
            </Card>
        );
    };

    // Respone View
    Right_ResponseViwer_Type_Change = (event, newValue) => {
        this.setState({ responseViwerType: newValue });
    };
    RightPart = () => {
        return (
            <Card sx={{ my: 2 }}>
                <CardContent>
                    <Grid
                        container="container"
                        spacing={2}
                        columns={{ xs: 4, sm: 8, md: 12 }}
                    >
                        <TabContext value={this.state.responseViwerType}>
                            <Box
                                sx={{ borderBottom: 1, borderColor: "divider" }}
                            >
                                <TabList
                                    onChange={
                                        this.Right_ResponseViwer_Type_Change
                                    }
                                    aria-label="lab API tabs example"
                                >
                                    <Tab label="Item One" value="1" />
                                    <Tab label="Item Two" value="2" />
                                </TabList>
                            </Box>
                            <TabPanel value="1">Item One</TabPanel>
                            <TabPanel value="2">Item Two</TabPanel>
                        </TabContext>
                    </Grid>
                </CardContent>
            </Card>
        );
    };

    render() {
        return (
            <Container maxWidth="lg">
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <this.PartInformation />
                        <this.Partclassification />
                        <this.PartTags />
                        <this.PartOptions />
                        <EditorAction input={this.state.input} />
                    </Grid>
                    <Grid item xs={6}>
                        <this.RightPart />
                    </Grid>
                </Grid>
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
            </Container>
        );
    }
}
