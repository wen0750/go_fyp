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
import { MuiChipsInput } from "mui-chips-input";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import { RadioGroup, RadioButton } from "react-radio-buttons";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import Tooltip from '@mui/material/Tooltip';
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { ThirtyFpsSelect } from "@mui/icons-material";
import { Form } from "react-router-dom";

export default class EditorTemplate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            option: "",
            FormData: {},
            responseType: "1",
            option_responseType: "1",
            Matchers_responseType: "1",
            Extractors_responseType: "1",
            responseViwerType: 1,
        };

        const ITEM_HEIGHT = 40;
        const ITEM_PADDING_TOP = 8;

        this.MyComponent = () => {
            const [chips, setChips] = React.useState([]);

            const handleChange = (newChips) => {
                setChips(newChips);
                this.tag_inputhandler(newChips, "ta");
            };

            return <MuiChipsInput value={chips} onChange={handleChange} />;
        };

        this.Payload_key_Component = () => {
            const [chips, setChips] = React.useState([]);

            const handleChange = (newChips) => {
                setChips(newChips);
                this.tag_inputhandler(newChips, "payload_tag1");
            };

            return <MuiChipsInput value={chips} onChange={handleChange} />;
        };

        this.info_inputhandler = (catalog, name, value) => {
            const data = this.props.templatedata;
            data[name] = value;
            this.props.dataChange(data);
        };

        this.tag_inputhandler = (newdata, key) => {
            const data = this.props.templatedata;
            data[key] = newdata.toString();
            this.props.dataChange(data);
        };

        this.TagMyComponent = () => {
            const [chips, setChips] = React.useState([]);
            const TaghandleChange = (newChips) => {
                setChips(newChips);
                this.tag_inputhandler(newChips, "tags");
            };

            return <MuiChipsInput value={chips} onChange={TaghandleChange} />;
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
            //this.props.dataChange(this.state.FormData);
            console.log(this.state.FormData);
        };

        this.all_changeFormData= (catalog, name, value) => {
            console.log(this.state.FormData);
            console.log(catalog);
            console.log(name);
            console.log(value);
            if (catalog in this.state.FormData) {
                const newdata = this.state.FormData;
                newdata[catalog][name] = value;
                this.setState({ FormData: newdata });
            } else {
                const newdata = this.state.FormData;
                newdata[catalog] = {};
                newdata[catalog][name] = value;
                this.setState({ FormData: newdata });
            }
            //this.props.dataChange(this.state.FormData);
            console.log(this.state.FormData);
        };

        this.fuzzing_changeFormData= (catalog, name, value) => {
            
            console.log(this.state.FormData);
            console.log(catalog);
            console.log(name);
            console.log(value);
            if (catalog in this.state.FormData) {
                const newdata = this.state.FormData;
                newdata[catalog][name] = value;
                this.setState({ FormData: newdata });
            } else {
                const newdata = this.state.FormData;
                newdata[catalog] = {};
                newdata[catalog][name] = value;
                this.setState({ FormData: newdata });
            }
            //this.props.dataChange(this.state.FormData);
            console.log(this.state.FormData);
        };

        this.classificationOptionList = [
            {
                key: 0,
                label: "cvss-metrics",
                type: "TextField",
                visible: true,
                removable: false,
                tooltip: "CVSS Metrics for the template.",
            },
            {
                key: 1,
                label: "cvss-score",
                type: "TextField",
                visible: true,
                removable: false,
                tooltip: "CVSS Score for the template.",
            },
            {
                key: 2,
                label: "cve-id",
                type: "CVE",
                visible: true,
                removable: false,
                tooltip: "CVE ID for the template",
            },
            {
                key: 3,
                label: "cwe-id",
                type: "TextField",
                visible: true,
                removable: false,
                tooltip: "CWE ID for the template.",
            },
        ];
        this.infomationList = [
            {
                key: 0,
                label: "name",
                type: "TextField",
                visible: true,
                removable: false,
                tooltip: "Name should be good short summary that identifies what the template does.",
            },
            {
                key: 1,
                label: "author",
                type: "TextField",
                visible: true,
                removable: false,
                tooltip: "Author of the template.",
            },
            {
                key: 2,
                label: "severity",
                type: "SigleSelect",
                value: ["info", "high", "medium", "critical", "low", "unknown"],
                visible: true,
                removable: false,
                tooltip:
                    "Severity of the template.",
            },
            {
                key: 3,
                label: "reference",
                type: "filled",
                visible: true,
                removable: false,
                tooltip:
                    "This should contain links relevant to the template.",
            },
            {
                key: 4,
                label: "description",
                type: "multiline",
                visible: true,
                removable: false,
                tooltip:
                    "Description of the template.",
            },
        ];
        this.httpinfoOptionList = [
            {
                key: 0,
                label: "Method(Auto)",
                type: "TextField",
                visible: true,
                removable: false,
                tooltip: "Method is the HTTP Request Method.",
            },
            {
                key: 1,
                label: "Paths: {{BaseURL}}/login",
                type: "filled",
                visible: true,
                removable: false,
                tooltip: "Path contains the path/s for the HTTP requests. It supports variables as placeholders.",
            },
            {
                key: 2,
                label: "Headers:",
                type: "multiline",
                visible: true,
                removable: false,
                tooltip: "Headers contains HTTP Headers to send with the request.",
            },
        ];
        this.RawinfoOptionList = [
            {
                key: 0,
                label: "Raw:",
                type: "multiline",
                visible: true,
                removable: false,
                tooltip: "Raw contains HTTP Requests in Raw format.",
            },
        ];
        this.Type_Status = [
            {
                key: 0,
                label: "Status",
                type: "TextField",
                visible: true,
                removable: false,
                tooltip: "Status Code received from the Server",
            },
            {
                key: 1,
                label: "Status",
                type: "TextField",
                visible: true,
                removable: false,
                tooltip: "Status Code received from the Server",
            },
            {
                key: 2,
                label: "Status:",
                type: "TextField",
                visible: true,
                removable: false,
                tooltip: "Status Code received from the Server",
            },
        ];
    }

    left_Options_Type_Change = (event, newValue) => {
        this.setState({ option_responseType: newValue });
    };

    left_Matchers_Type_Change = (event, newValue) => {
        this.setState({ Matchers_responseType: newValue });
    };

    left_Extractors_Type_Change = (event, newValue) => {
        this.setState({ Extractors_responseType: newValue });
    };

    Title = () => {
        return (
          <div>
            Tag
            <Tooltip title={<h1>Any tags for the template.Multiple values can also be specified separated by commas.</h1>}>
              <IconButton >
                <HelpOutlineIcon 
                    fontSize={"large"}/>
              </IconButton>
            </Tooltip>
          </div>
        );
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
                            callback={this.info_inputhandler}
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
                            callback={this.info_inputhandler}
                        ></FormTableFormat>
                    </Grid>
                </CardContent>
            </Card>
        );
    };

    PartTags = () => {
        return (
            <Card sx={{ my: 2 }}>
                <CardHeader title={<this.Title />} />
                <CardContent>
                    <Grid
                        container="container"
                        spacing={2}
                        columns={{ xs: 4, sm: 8, md: 12 }}
                    ></Grid>
                    
                    <this.TagMyComponent />
                </CardContent>
            </Card>
        );
    };

    PartOptions = () => {
        return (
            <Card sx={{ my: 2 }}>
                <CardHeader title="Options" />
                <hr />
                <CardContent>
                    <div className="horizontal-line"></div>
                    <Grid spacing={2} columns={{ xs: 4, sm: 8, md: 12 }}>
                        <TabContext value={this.state.option_responseType}>
                            <Box
                                sx={{ borderBottom: 1, borderColor: "divider" }}
                            >
                                <TabList
                                    onChange={this.left_Options_Type_Change}
                                >
                                    <Tab label="Base HTTP" value="1" />
                                    <Tab label="Raw" value="2" />
                                </TabList>
                            </Box>
                            <TabPanel value="1">
                                <FormTableFormat
                                    catalog="Options"
                                    opts={this.httpinfoOptionList}
                                    callback={this.info_inputhandler}
                                ></FormTableFormat>
                            </TabPanel>
                            <TabPanel value="2">
                                <FormTableFormat
                                    catalog="options"
                                    opts={this.RawinfoOptionList}
                                    callback={this.info_inputhandler}
                                ></FormTableFormat>
                            </TabPanel>
                        </TabContext>
                    </Grid>
                </CardContent>
            </Card>
        );
    };

    Partpayloads = () => {
        const [data, setData] = useState([{ key: "", tab: "" }]);

        const handleClick = () => {
            setData([...data, { key: "", tab: "" }]);
        };

        const handleChange = (e, i) => {
            const { name, value } = e.target;
            const onchangeVal = [...data];
            onchangeVal[i][name] = value;
            setData(onchangeVal);
        };

        const handleDelete = (i) => {
            const deleteVal = [...data];
            deleteVal.splice(i, 1);
            setData(deleteVal);
        };

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
                    <div className="App">
                        {data.map((val, i) => (
                            <div>
                                <Grid container spacing={3}>
                                    <Grid item xs={4}>
                                        <TextField
                                            id="Key"
                                            label="key "
                                            variant="outlined"
                                            lname="fname"
                                            value={val.fname}
                                            onChange={(e) => handleChange(e, i)}
                                            callback={this.info_inputhandler}
                                        />
                                    </Grid>
                                    <Grid item xs={7}>
                                        <this.Payload_key_Component
                                            name="tab"
                                            value={val.lname}
                                            onChange={(e) => handleChange(e, i)}
                                            callback={this.info_inputhandler}
                                        />
                                    </Grid>
                                    <Grid item xs={1}>
                                        <IconButton
                                            aria-label="delete"
                                            size="large"
                                            onClick={() => handleDelete(i)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                                <CardContent>
                                    <Grid
                                        container="container"
                                        spacing={2}
                                        columns={{ xs: 4, sm: 8, md: 12 }}
                                    ></Grid>
                                </CardContent>
                            </div>
                        ))}
                        <Button
                            variant="outlined"
                            onClick={handleClick}
                            startIcon={<AddIcon />}
                        >
                            Add Key
                        </Button>
                    </div>
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
                            {data.length <= 2 ? (
                                <RadioButton
                                    rootColor="Gray"
                                    value="Batteringram"
                                    iconSize={20}
                                    callback={this.info_inputhandler}
                                >
                                    Batteringram
                                </RadioButton>
                            ) : (
                                <RadioButton
                                    rootColor="Gray"
                                    value="Batteringram"
                                    disabled
                                    iconSize={20}
                                    callback={this.info_inputhandler}
                                >
                                    Batteringram
                                </RadioButton>
                            )}
                            <RadioButton
                                rootColor="Gray"
                                value="Pitchfork"
                                iconSize={20}
                                callback={this.info_inputhandler}
                            >
                                Pitchfork
                            </RadioButton>
                            <RadioButton
                                rootColor="Gray"
                                value="Clusterbomb"
                                iconSize={20}
                                callback={this.info_inputhandler}
                            >
                                Clusterbomb
                            </RadioButton>
                        </RadioGroup>
                    </Grid>
                </CardContent>
            </Card>
        );
    };

    PartFuzzing = () => {
        const [Fuzz, setFuzz] = React.useState("");

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
                    <Box sx={{ borderBottom: 1, borderColor: "divider" }}></Box>
                </CardContent>
                <CardHeader title="Part" />
                <CardContent>
                    <Grid
                        container="container"
                        spacing={2}
                        columns={{ xs: 4, sm: 8, md: 12 }}
                    ></Grid>
                    <Grid container spacing={2}>
                        <RadioGroup onChange={(event) => this.all_changeFormData("Fuzzing","part", event)} horizontal>
                            <RadioButton
                                rootColor="Gray"
                                value="query"
                                iconSize={20}
                                
                            >
                                query
                            </RadioButton>
                            <RadioButton
                                rootColor="Gray"
                                value="path"
                                iconSize={20}
                                
                            >
                                path
                            </RadioButton>
                            <RadioButton
                                rootColor="Gray"
                                value="header"
                                iconSize={20}
                                
                            >
                                header
                            </RadioButton>
                            <RadioButton
                                rootColor="Gray"
                                value="body"
                                iconSize={20}
                                
                            >
                                body
                            </RadioButton>
                            <RadioButton
                                rootColor="Gray"
                                value="cookie"
                                iconSize={20}
                                
                            >
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
                        <RadioGroup onChange={(event) => this.all_changeFormData("Fuzzing","type", event)} horizontal>
                            <RadioButton
                                rootColor="Gray"
                                value="replace"
                                iconSize={20}
                            >
                                replace
                            </RadioButton>
                            <RadioButton
                                rootColor="Gray"
                                value="prefix"
                                iconSize={20}
                            >
                                prefix
                            </RadioButton>
                            <RadioButton
                                rootColor="Gray"
                                value="postfix"
                                iconSize={20}
                            >
                                postfix
                            </RadioButton>
                            <RadioButton
                                rootColor="Gray"
                                value="body"
                                iconSize={20}
                            >
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
                        <RadioGroup onChange={(event) => this.all_changeFormData("Fuzzing","Mode", event)} horizontal>
                            <RadioButton
                                rootColor="Gray"
                                value="Multiple"
                                iconSize={20}
                            >
                                Multiple
                            </RadioButton>
                            <RadioButton
                                rootColor="Gray"
                                value="Single"
                                iconSize={20}
                            >
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
                                <InputLabel id="Fuzz-select-label">
                                    Fuzz
                                </InputLabel>
                                <Select 
                                    labelId="Fuzz-simple-select-label"
                                    id="Fuzz-simple-select"
                                    value={Fuzz}
                                    label="Fuzz"
                                    onChange={(event) => {
                                        handleChange(event);
                                        this.fuzzing_changeFormData("Fuzzing", "Fuzz", event);
                                    }}
                                >
                                    <MenuItem value={1}>keys</MenuItem>
                                    <MenuItem value={2}>keys-regex</MenuItem>
                                    <MenuItem value={3}>values</MenuItem>
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

    PartMatchers = () => {
        const [data, setData] = useState([{ key: "", tab: "" }]);

        const handleClick = () => {
            setData([...data, { key: "", tab: "" }]);
        };

        const handleChange = (e, i) => {
            const { name, value } = e.target;
            const onchangeVal = [...data];
            onchangeVal[i][name] = value;
            setData(onchangeVal);
        };

        const handleDelete = (i) => {
            const deleteVal = [...data];
            deleteVal.splice(i, 1);
            setData(deleteVal);
        };

        return (
            <Card sx={{ my: 2 }}>
                <CardHeader title="Matchers-condition" />
                <hr />
                <CardContent>
                    <Grid spacing={2} columns={{ xs: 4, sm: 8, md: 12 }}>
                        <Grid>
                            <RadioGroup onChange={(event) => this.all_changeFormData("Matchers","condition", event)} horizontal>
                                <RadioButton
                                    rootColor="Gray"
                                    value="and"
                                    iconSize={20}
                                >
                                    and
                                </RadioButton>

                                <RadioButton
                                    rootColor="Gray"
                                    value="or"
                                    iconSize={20}
                                >
                                    or
                                </RadioButton>
                            </RadioGroup>
                        </Grid>
                        <Grid>
                            <TabContext
                                value={this.state.Matchers_responseType}
                            >
                                <Box
                                    sx={{
                                        borderBottom: 1,
                                        borderColor: "divider",
                                    }}
                                >
                                    <TabList
                                        onChange={
                                            this.left_Matchers_Type_Change
                                        }
                                    >
                                        <Tab label="status" value="1" />
                                        <Tab label="size" value="2" />
                                        <Tab label="word" value="3" />
                                        <Tab label="regex" value="4" />
                                        <Tab label="binary" value="5" />
                                        <Tab label="dsl" value="6" />
                                        <Tab label="xpath" value="7" />
                                    </TabList>
                                </Box>
                                <TabPanel value="1">
                                    <FormTableFormat
                                        catalog="Options"
                                        opts={this.Type_Status}
                                    ></FormTableFormat>
                                </TabPanel>
                                <TabPanel value="2">
                                    <CardContent>
                                        <Grid
                                            container="container"
                                            spacing={2}
                                            columns={{ xs: 4, sm: 8, md: 12 }}
                                        ></Grid>
                                        <div className="App">
                                            {data.map((val, i) => (
                                                <div>
                                                    <Grid container spacing={3}>
                                                        <Grid item xs={4}>
                                                            <TextField
                                                                id="Key"
                                                                label="key "
                                                                variant="outlined"
                                                                lname="fname"
                                                                value={
                                                                    val.fname
                                                                }
                                                                onChange={(e) =>
                                                                    handleChange(
                                                                        e,
                                                                        i
                                                                    )
                                                                }
                                                            />
                                                        </Grid>
                                                        <Grid item xs={7}>
                                                            <this.MyComponent
                                                                name="tab"
                                                                value={
                                                                    val.lname
                                                                }
                                                                onChange={(e) =>
                                                                    handleChange(
                                                                        e,
                                                                        i
                                                                    )
                                                                }
                                                            />
                                                        </Grid>
                                                        <Grid item xs={1}>
                                                            <IconButton
                                                                aria-label="delete"
                                                                size="large"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        i
                                                                    )
                                                                }
                                                            >
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </Grid>
                                                    </Grid>
                                                    <CardContent>
                                                        <Grid
                                                            container="container"
                                                            spacing={2}
                                                            columns={{
                                                                xs: 4,
                                                                sm: 8,
                                                                md: 12,
                                                            }}
                                                        ></Grid>
                                                    </CardContent>
                                                </div>
                                            ))}
                                            <Button
                                                variant="outlined"
                                                onClick={handleClick}
                                                startIcon={<AddIcon />}
                                            >
                                                Add Key
                                            </Button>
                                        </div>
                                    </CardContent>
                                </TabPanel>
                                <TabPanel value="3">
                                    <Grid
                                        container
                                        spacing={{ xs: 2, md: 4 }}
                                        columns={{ xs: 4, sm: 8, md: 12 }}
                                    >
                                        <Grid item xs={2} sm={4} md={4}>
                                            <TextField
                                                id="Name"
                                                label="Name"
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={2} sm={4} md={4}>
                                            <TextField
                                                id="Encoding"
                                                label="Encoding"
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={2} sm={4} md={4}>
                                            <TextField
                                                id="Part"
                                                label="Part"
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={2} sm={4} md={4}>
                                            <CardHeader title="condition" />
                                            <RadioGroup horizontal>
                                                <RadioButton
                                                    xs={2}
                                                    rootColor="Gray"
                                                    value="OR"
                                                    iconSize={20}
                                                >
                                                    or
                                                </RadioButton>
                                                <RadioButton
                                                    xs={2}
                                                    rootColor="Gray"
                                                    value="AMD"
                                                    iconSize={20}
                                                >
                                                    and
                                                </RadioButton>
                                            </RadioGroup>
                                        </Grid>
                                        <Grid item xs={2} sm={4} md={4}>
                                            <CardHeader title="Negative" />
                                            <RadioGroup horizontal>
                                                <RadioButton
                                                    xs={2}
                                                    rootColor="Gray"
                                                    value="False"
                                                    iconSize={20}
                                                >
                                                    False
                                                </RadioButton>
                                                <RadioButton
                                                    xs={2}
                                                    rootColor="Gray"
                                                    value="True"
                                                    iconSize={20}
                                                >
                                                    True
                                                </RadioButton>
                                            </RadioGroup>
                                        </Grid>
                                    </Grid>
                                    <CardHeader title="Word" />
                                    <this.MyComponent />
                                </TabPanel>
                                <TabPanel value="4">
                                    <Grid
                                        container
                                        spacing={{ xs: 2, md: 4 }}
                                        columns={{ xs: 4, sm: 8, md: 12 }}
                                    >
                                        <Grid item xs={2} sm={4} md={4}>
                                            <CardHeader title="Part" />
                                            <TextField
                                                id="Name"
                                                label="Name"
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={2} sm={4} md={4}>
                                            <CardHeader title="condition" />
                                            <RadioGroup horizontal>
                                                <RadioButton
                                                    xs={2}
                                                    rootColor="Gray"
                                                    value="AND"
                                                    iconSize={20}
                                                >
                                                    AND
                                                </RadioButton>
                                                <RadioButton
                                                    xs={2}
                                                    rootColor="Gray"
                                                    value="OR"
                                                    iconSize={20}
                                                >
                                                    OR
                                                </RadioButton>
                                            </RadioGroup>
                                        </Grid>
                                    </Grid>
                                    <CardHeader title="Regex" />
                                    <TextField fullWidth label="" id="Regex" />
                                </TabPanel>
                                <TabPanel value="5">
                                    <Grid
                                        container
                                        spacing={{ xs: 2, md: 4 }}
                                        columns={{ xs: 4, sm: 8, md: 12 }}
                                    >
                                        <Grid item xs={2} sm={4} md={4}>
                                            <CardHeader title="Part" />
                                            <TextField
                                                id="Name"
                                                label="Name"
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={2} sm={4} md={4}>
                                            <CardHeader title="condition" />
                                            <RadioGroup horizontal>
                                                <RadioButton
                                                    xs={2}
                                                    rootColor="Gray"
                                                    value="AND"
                                                    iconSize={20}
                                                >
                                                    AND
                                                </RadioButton>
                                                <RadioButton
                                                    xs={2}
                                                    rootColor="Gray"
                                                    value="OR"
                                                    iconSize={20}
                                                >
                                                    OR
                                                </RadioButton>
                                            </RadioGroup>
                                        </Grid>
                                        <Grid item xs={2} sm={4} md={4}>
                                            <CardHeader title="Negative" />
                                            <RadioGroup horizontal>
                                                <RadioButton
                                                    xs={2}
                                                    rootColor="Gray"
                                                    value="False"
                                                    iconSize={20}
                                                >
                                                    False
                                                </RadioButton>
                                                <RadioButton
                                                    xs={2}
                                                    rootColor="Gray"
                                                    value="True"
                                                    iconSize={20}
                                                >
                                                    True
                                                </RadioButton>
                                            </RadioGroup>
                                        </Grid>
                                        <CardHeader title="Binary" />
                                        <this.MyComponent />
                                    </Grid>
                                </TabPanel>
                                <TabPanel value="6">
                                    <Grid
                                        container
                                        spacing={{ xs: 2, md: 4 }}
                                        columns={{ xs: 4, sm: 8, md: 12 }}
                                    >
                                        <Grid item xs={2} sm={4} md={4}>
                                            <CardHeader title="Name" />
                                            <TextField
                                                id="Name"
                                                label="Name"
                                                variant="outlined"
                                            />
                                        </Grid>
                                    </Grid>
                                    <CardHeader title="dsl" />
                                    <TextField fullWidth label="" id="dsl" />
                                </TabPanel>
                                <TabPanel value="7">
                                    <Grid
                                        container
                                        spacing={{ xs: 2, md: 4 }}
                                        columns={{ xs: 4, sm: 8, md: 12 }}
                                    >
                                        <Grid item xs={2} sm={4} md={4}>
                                            <CardHeader title="attribute" />
                                            <TextField
                                                id="Name"
                                                label="attribute"
                                                variant="outlined"
                                            />
                                        </Grid>
                                    </Grid>
                                    <CardHeader title="xpath" />
                                    <TextField fullWidth label="" id="xpath" />
                                </TabPanel>
                            </TabContext>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        );
    };

    PartExtractors = () => {
        const [data, setData] = useState([{ key: "", tab: "" }]);

        const handleClick = () => {
            setData([...data, { key: "", tab: "" }]);
        };

        const handleChange = (e, i) => {
            const { name, value } = e.target;
            const onchangeVal = [...data];
            onchangeVal[i][name] = value;
            setData(onchangeVal);
        };

        const handleDelete = (i) => {
            const deleteVal = [...data];
            deleteVal.splice(i, 1);
            setData(deleteVal);
        };

        return (
            <Card sx={{ my: 2 }}>
                <CardHeader title="Extractors" />
                <hr />
                <CardContent>
                    <Grid spacing={2} columns={{ xs: 4, sm: 8, md: 12 }}>
                        <Grid>
                            <TabContext
                                value={this.state.Extractors_responseType}
                            >
                                <Box
                                    sx={{
                                        borderBottom: 1,
                                        borderColor: "divider",
                                    }}
                                >
                                    <TabList
                                        onChange={
                                            this.left_Extractors_Type_Change
                                        }
                                    >
                                        <Tab label="regex" value="1" />
                                        <Tab label="kval" value="2" />
                                        <Tab label="json" value="3" />
                                        <Tab label="xpath" value="4" />
                                        <Tab label="dsl" value="5" />
                                    </TabList>
                                </Box>
                                <TabPanel value="1">
                                    <Grid
                                        container
                                        spacing={{ xs: 2, md: 4 }}
                                        columns={{ xs: 4, sm: 8, md: 12 }}
                                    >
                                        <Grid item xs={2} sm={4} md={4}>
                                            <CardHeader title="Nmae" />
                                            <TextField
                                                id="Name"
                                                label="Name"
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={2} sm={4} md={4}>
                                            <CardHeader title="Part" />
                                            <TextField
                                                id="Part"
                                                label="Part"
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={2} sm={4} md={4}>
                                            <CardHeader title="condition" />
                                            <RadioGroup horizontal>
                                                <RadioButton
                                                    xs={2}
                                                    rootColor="Gray"
                                                    value="AND"
                                                    iconSize={20}
                                                >
                                                    AND
                                                </RadioButton>
                                                <RadioButton
                                                    xs={2}
                                                    rootColor="Gray"
                                                    value="OR"
                                                    iconSize={20}
                                                >
                                                    OR
                                                </RadioButton>
                                            </RadioGroup>
                                        </Grid>
                                        <Grid item xs={2} sm={4} md={4}>
                                            <CardHeader title="internal" />
                                            <TextField
                                                id="internal"
                                                label="internal"
                                                variant="outlined"
                                            />
                                        </Grid>
                                    </Grid>
                                    <CardHeader title="Regex" />
                                    <TextField fullWidth label="" id="Regex" />
                                </TabPanel>
                                <TabPanel value="2">
                                    <Grid
                                        container
                                        spacing={{ xs: 2, md: 4 }}
                                        columns={{ xs: 4, sm: 8, md: 12 }}
                                    >
                                        <Grid item xs={2} sm={4} md={4}>
                                            <TextField
                                                id="kval"
                                                label="kval"
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={2} sm={4} md={4}>
                                            <TextField
                                                id="kval"
                                                label="kval"
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={2} sm={4} md={4}>
                                            <TextField
                                                id="kval"
                                                label="kval"
                                                variant="outlined"
                                            />
                                        </Grid>
                                    </Grid>
                                </TabPanel>
                                <TabPanel value="3">
                                    <Grid
                                        container
                                        spacing={{ xs: 2, md: 4 }}
                                        columns={{ xs: 4, sm: 8, md: 12 }}
                                    >
                                        <Grid item xs={2} sm={4} md={4}>
                                            <CardHeader title="Name" />
                                            <TextField
                                                id="Name"
                                                label="Name"
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={2} sm={4} md={4}>
                                            <CardHeader title="Part" />
                                            <TextField
                                                id="Part"
                                                label="Part"
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={2} sm={4} md={4}>
                                            <CardHeader title="condition" />
                                            <RadioGroup horizontal>
                                                <RadioButton
                                                    xs={2}
                                                    rootColor="Gray"
                                                    value="AND"
                                                    iconSize={20}
                                                >
                                                    AND
                                                </RadioButton>
                                                <RadioButton
                                                    xs={2}
                                                    rootColor="Gray"
                                                    value="OR"
                                                    iconSize={20}
                                                >
                                                    OR
                                                </RadioButton>
                                            </RadioGroup>
                                        </Grid>
                                        <CardHeader title="json" />
                                        <this.MyComponent />
                                    </Grid>
                                </TabPanel>
                                <TabPanel value="4">
                                    <Grid
                                        container
                                        spacing={{ xs: 2, md: 4 }}
                                        columns={{ xs: 4, sm: 8, md: 12 }}
                                    >
                                        <Grid item xs={2} sm={4} md={4}>
                                            <CardHeader title="attribute" />
                                            <TextField
                                                id="attribute"
                                                label="attribute"
                                                variant="outlined"
                                            />
                                        </Grid>
                                    </Grid>
                                    <CardHeader title="xpath" />
                                    <TextField fullWidth label="" id="xpath" />
                                </TabPanel>
                                <TabPanel value="5">
                                    <Grid
                                        container
                                        spacing={{ xs: 2, md: 4 }}
                                        columns={{ xs: 4, sm: 8, md: 12 }}
                                    >
                                        <Grid item xs={2} sm={4} md={4}>
                                            <CardHeader title="Name" />
                                            <TextField
                                                id="Name"
                                                label="Name"
                                                variant="outlined"
                                            />
                                        </Grid>
                                    </Grid>
                                    <CardHeader title="dsl" />
                                    <TextField fullWidth label="" id="dsl" />
                                </TabPanel>
                            </TabContext>
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

    render() {
        return (
            <Container maxWidth="lg">
                <this.PartInformation />
                <this.PartTags />
                <this.Partclassification />
                <this.PartOptions />
                <this.Partpayloads />
                <this.PartFuzzing />
                <this.PartMatchers />
                <this.PartExtractors />
            </Container>
        );
    }
}
