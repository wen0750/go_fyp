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
import { MuiChipsInput } from "mui-chips-input";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import { RadioGroup, RadioButton } from "react-radio-buttons";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { ThirtyFpsSelect } from "@mui/icons-material";

export default class EditorTemplate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            option: "",
            FormData: {},
            responseType: "1",
            responseViwerType: 1,
        };

        const ITEM_HEIGHT = 40;
        const ITEM_PADDING_TOP = 8;
        
        this.MyComponent = () => {
            const [chips, setChips] = React.useState([]);

            const handleChange = (newChips) => {
                setChips(newChips);
            };

            return <MuiChipsInput value={chips} onChange={handleChange} />;
        };

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
        this.httpinfoOptionList = [
            {
                key: 0,
                label: "Method(Auto)",
                type: "TextField",
                visible: true,
                removable: false,
            },
            {
                key: 1,
                label: "Paths: {{BaseURL}}/login",
                type: "filled",
                visible: true,
                removable: false,
            },
            {
                key: 2,
                label: "Headers:",
                type: "multiline",
                visible: true,
                removable: false,
            },
        ];
        this.RawinfoOptionList = [
            {
                key: 0,
                label: "Raw:",
                type: "multiline",
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

    Partclassification = () => {
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
                    <this.MyComponent />
                </CardContent>
            </Card>
        );
    };

    left_ResponseViwer_Type_Change = (event, newValue) => {
        this.setState({ responseType: newValue });
    };

    PartOptions = () => {
        return (
            <Card sx={{ my: 2 }}>
                <CardHeader title="Options" />
                <hr />
                <CardContent>
                    <div className="horizontal-line"></div>
                    <Grid spacing={2} columns={{ xs: 4, sm: 8, md: 12 }}>
                        <TabContext value={this.state.responseType}>
                            <Box
                                sx={{ borderBottom: 1, borderColor: "divider" }}
                            >
                                <TabList
                                    onChange={
                                        this.left_ResponseViwer_Type_Change
                                    }
                                >
                                    <Tab label="Base HTTP" value="1" />
                                    <Tab label="Raw" value="2" />
                                </TabList>
                            </Box>
                            <TabPanel value="1">
                                <FormTableFormat
                                    catalog="Options"
                                    opts={this.httpinfoOptionList}
                                ></FormTableFormat>
                            </TabPanel>
                            <TabPanel value="2">
                                <FormTableFormat
                                    catalog="options"
                                    opts={this.RawinfoOptionList}
                                ></FormTableFormat>
                            </TabPanel>
                        </TabContext>
                    </Grid>
                </CardContent>
            </Card>
        );
    };

    Partpayloads = () => {
        return (
            <Card sx={{ my: 2 }}>
                <CardHeader title="Payloads" />
                <hr />
                <CardContent>
                    <Grid
                        container="container"
                        spacing={2}
                        columns={{ xs: 4, sm: 8, md: 12 }}
                    ></Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <TextField
                                id="key 1"
                                label="key 1"
                                variant="outlined"
                            />
                            <TextField
                                id="key 2"
                                label="key 2"
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={8}>
                            <this.MyComponent />
                            <this.MyComponent />
                        </Grid>
                    </Grid>
                    <Button variant="outlined" startIcon={<AddIcon />}>
                        Add
                    </Button>
                </CardContent>
                <CardHeader title="Attack mode:" />
                <CardContent>
                    <Grid
                        container="container"
                        spacing={2}
                        columns={{ xs: 4, sm: 8, md: 12 }}
                    ></Grid>
                    <Grid container spacing={2}>
                        <RadioGroup horizontal>
                            <RadioButton rootColor="Silver" value="Batteringram">
                                Batteringram
                            </RadioButton>
                            <RadioButton rootColor="Silver" value="Pitchfork">
                                Pitchfork
                            </RadioButton>
                            <RadioButton rootColor="Silver" value="Clusterbomb">
                                Clusterbomb
                            </RadioButton>
                        </RadioGroup>
                    </Grid>
                </CardContent>
            </Card>
        );
    };

    PartFuzzing = () => {
        const [Fuzz, setFuzz] = React.useState('');

        const handleChange = (event) => {
            setFuzz(event.target.value);
        };

        return (
            <Card sx={{ my: 2 }}>
                <CardHeader title="Fuzzing" />
                <hr />
                <CardContent>
                    <Grid
                        container="container"
                        spacing={2}
                        columns={{ xs: 4, sm: 8, md: 12 }}
                    ></Grid>
                    <Box
                        sx={{ borderBottom: 1, borderColor: "divider" }}   
                    >
                    </Box>
                </CardContent>
                <CardHeader title="Part" />
                <CardContent>
                    <Grid
                        container="container"
                        spacing={2}
                        columns={{ xs: 4, sm: 8, md: 12 }}
                    ></Grid>
                    <Grid container spacing={2}>
                        <RadioGroup horizontal>
                            <RadioButton rootColor="Silver" value="query">
                                query
                            </RadioButton>
                            <RadioButton rootColor="Silver" value="path">
                                path
                            </RadioButton>
                            <RadioButton rootColor="Silver" value="header">
                                header
                            </RadioButton>
                            <RadioButton rootColor="Silver" value="body">
                                body
                            </RadioButton>
                            <RadioButton rootColor="Silver" value="cookie">
                                cookie
                            </RadioButton>
                        </RadioGroup>
                    </Grid>
                </CardContent>
                <CardHeader title="Type" />
                <CardContent>
                    <Grid
                        container="container"
                        spacing={2}
                        columns={{ xs: 4, sm: 8, md: 12 }}
                    ></Grid>
                    <Grid container spacing={2}>
                        <RadioGroup horizontal>
                            <RadioButton rootColor="Silver" value="replace">
                                replace
                            </RadioButton>
                            <RadioButton rootColor="Silver" value="prefix">
                                prefix
                            </RadioButton>
                            <RadioButton rootColor="Silver" value="postfix">
                                postfix
                            </RadioButton>
                            <RadioButton rootColor="Silver" value="body">
                                body
                            </RadioButton>
                        </RadioGroup>
                    </Grid>
                </CardContent>
                <CardHeader title="Mode" />
                <CardContent>
                    <Grid
                        container="container"
                        spacing={2}
                        columns={{ xs: 4, sm: 8, md: 12 }}
                    ></Grid>
                    <Grid container spacing={2}>
                        <RadioGroup horizontal>
                            <RadioButton rootColor="Silver" value="Multiple">
                                Multiple
                            </RadioButton>
                            <RadioButton rootColor="Silver" value="Single">
                                Single
                            </RadioButton>
                        </RadioGroup>
                    </Grid>
                </CardContent>
                <CardHeader title="Fuzz" />
                <CardContent>
                    <Grid container spacing={2}>
                            <Grid item xs={4}>
                                <FormControl fullWidth>
                                    <InputLabel id="Fuzz-select-label">Fuzz</InputLabel>
                                    <Select
                                        labelId="Fuzz-simple-select-label"
                                        id="Fuzz-simple-select"
                                        value={Fuzz}
                                        label="Fuzz"
                                        onChange={handleChange}
                                    >
                                        <MenuItem value={10}>keys</MenuItem>
                                        <MenuItem value={20}>keys-regex</MenuItem>
                                        <MenuItem value={30}>values</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={8}>
                                <this.MyComponent />
                            </Grid>
                    </Grid>
                </CardContent>
            </Card>
        );
    };

    // Respone View
    // fatch data
    componentDidMount() {
        this.fetchData();
    }

    fetchData = async () => {
        try {
            const response = await fetch(
                "https://www.npmjs.com/package/react-syntax-highlighter"
            );
            const jsonData = await response.text();
            this.setState({ tmpdata: jsonData });
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    Right_ResponseViwer_Type_Change = (event, newValue) => {
        this.setState({ responseViwerType: newValue });
    };
    RightPart = () => {
        return (
            <Card sx={{ my: 2 }}>
                <CardContent>
                    <TabContext value={this.state.responseViwerType}>
                        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                            <TabList
                                onChange={this.Right_ResponseViwer_Type_Change}
                                aria-label="lab API tabs example"
                            >
                                <Tab label="HTML Code" value="1" />
                                <Tab label="Page Review" value="2" />
                            </TabList>
                        </Box>
                        <TabPanel
                            value="1"
                            sx={{
                                padding: 0,
                                height: "50%",
                                maxHeight: "500px",
                                overflow: "scroll",
                            }}
                        >
                            {" "}
                            {this.state.tmpdata}{" "}
                        </TabPanel>
                        <TabPanel
                            value="2"
                            sx={{
                                padding: 0,
                                height: "50%",
                                maxHeight: "500px",
                                overflowY: "scroll",
                            }}
                        >
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: this.state.tmpdata,
                                }}
                            ></div>
                        </TabPanel>
                    </TabContext>
                </CardContent>
            </Card>
        );
    };

    render() {
        return (
            <Container maxWidth="lg">
                <this.PartInformation />
                        <this.Partclassification />
                        <this.PartTags />
                        <this.PartOptions />
                        <this.Partpayloads />
                        <this.PartFuzzing />
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
