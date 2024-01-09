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
            responseViwerType: 1,
        };

        this.inputhandler = (event,key) => {
            // the key will like url / playload / tag / cve / etc...
            newdata= this.props.data
            newdata[key] = event.target.value
            this.props.dataChange(newdata)
        }

        this.tag_inputhandler = (newdata,key) => {
            // the key will like url / playload / tag / cve / etc...
            newdata= this.props.data
            newdata[key] = newdata
            this.props.dataChange(newdata)
        }

        this.props.dataChange 

        const ITEM_HEIGHT = 40;
        const ITEM_PADDING_TOP = 8;

        this.MyComponent = () => {
            const [chips, setChips] = React.useState([]);

            const handleChange = (newChips) => {
                setChips(newChips);
                this.tag_inputhandler(newChips)
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
        this.Type_Status = [
            {
                key: 0,
                label: "Status",
                type: "TextField",
                visible: true,
                removable: false,
            },
            {
                key: 1,
                label: "Status",
                type: "TextField",
                visible: true,
                removable: false,
            },
            {
                key: 2,
                label: "Status:",
                type: "TextField",
                visible: true,
                removable: false,
            },
        ];
        this.Type_size = [
            {
                key: 0,
                label: "Status",
                type: "TextField",
                visible: true,
                removable: false,
            },
            {
                key: 1,
                label: "Status",
                type: "TextField",
                visible: true,
                removable: false,
            },
            {
                key: 2,
                label: "Status:",
                type: "TextField",
                visible: true,
                removable: false,
            },
        ];
        this.Type_word = [
            {
                key: 0,
                label: "Status",
                type: "TextField",
                visible: true,
                removable: false,
            },
            {
                key: 1,
                label: "Status",
                type: "TextField",
                visible: true,
                removable: false,
            },
            {
                key: 2,
                label: "Status:",
                type: "TextField",
                visible: true,
                removable: false,
            },
        ];
        this.Type_regex = [
            {
                key: 0,
                label: "Status",
                type: "TextField",
                visible: true,
                removable: false,
            },
            {
                key: 1,
                label: "Status",
                type: "TextField",
                visible: true,
                removable: false,
            },
            {
                key: 2,
                label: "Status:",
                type: "TextField",
                visible: true,
                removable: false,
            },
        ];
        this.Type_binary = [
            {
                key: 0,
                label: "Status",
                type: "TextField",
                visible: true,
                removable: false,
            },
            {
                key: 1,
                label: "Status",
                type: "TextField",
                visible: true,
                removable: false,
            },
            {
                key: 2,
                label: "Status:",
                type: "TextField",
                visible: true,
                removable: false,
            },
        ];
        this.Type_dsl = [
            {
                key: 0,
                label: "Status",
                type: "TextField",
                visible: true,
                removable: false,
            },
            {
                key: 1,
                label: "Status",
                type: "TextField",
                visible: true,
                removable: false,
            },
            {
                key: 2,
                label: "Status:",
                type: "TextField",
                visible: true,
                removable: false,
            },
        ];
        this.Type_xpath = [
            {
                key: 0,
                label: "Status",
                type: "TextField",
                visible: true,
                removable: false,
            },
            {
                key: 1,
                label: "Status",
                type: "TextField",
                visible: true,
                removable: false,
            },
            {
                key: 2,
                label: "Status:",
                type: "TextField",
                visible: true,
                removable: false,
            },
        ]
    }

    left_Matchers_Type_Change = (event, newValue) => {
        this.setState({ responseType: newValue });
    };

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
                                        />
                                    </Grid>
                                    <Grid item xs={7}>
                                        <this.MyComponent
                                            name="tab"
                                            value={val.lname}
                                            onChange={(e) => handleChange(e, i)}
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
                                >
                                    Batteringram
                                </RadioButton>
                            ) : (
                                <RadioButton
                                    rootColor="Gray"
                                    value="Batteringram"
                                    disabled
                                    iconSize={20}
                                >
                                    Batteringram
                                </RadioButton>
                            )}
                            <RadioButton rootColor="Gray" value="Pitchfork" iconSize={20}>
                                Pitchfork
                            </RadioButton>
                            <RadioButton rootColor="Gray" value="Clusterbomb" iconSize={20}>
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
                        <RadioGroup horizontal>
                            <RadioButton rootColor="Gray" value="query" iconSize={20}>
                                query
                            </RadioButton>
                            <RadioButton rootColor="Gray" value="path" iconSize={20}>
                                path
                            </RadioButton>
                            <RadioButton rootColor="Gray" value="header"iconSize={20}>
                                header
                            </RadioButton>
                            <RadioButton rootColor="Gray" value="body" iconSize={20}>
                                body
                            </RadioButton>
                            <RadioButton rootColor="Gray" value="cookie" iconSize={20}>
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
                            <RadioButton rootColor="Gray" value="replace" iconSize={20}>
                                replace
                            </RadioButton>
                            <RadioButton rootColor="Gray" value="prefix" iconSize={20}>
                                prefix
                            </RadioButton>
                            <RadioButton rootColor="Gray" value="postfix" iconSize={20}>
                                postfix
                            </RadioButton>
                            <RadioButton rootColor="Gray" value="body" iconSize={20}>
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
                            <RadioButton rootColor="Gray" value="Multiple" iconSize={20}>
                                Multiple
                            </RadioButton>
                            <RadioButton rootColor="Gray" value="Single" iconSize={20}>
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
                                    onChange={handleChange}
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

    /*
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
                <CardHeader title="Matchers" />
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
                                            lname="key"
                                            value={val.tab}
                                            onChange={(e) => handleChange(e, i)}
                                        />
                                    </Grid>
                                    <Grid item xs={7}>
                                        <this.MyComponent
                                            name="key"
                                            value={val.tab}
                                            onChange={(e) => handleChange(e, i)}
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
                        <Button onClick={handleClick}>Add</Button>
                    </div>
                </CardContent>
            </Card>
        );
    }; */

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
                    <Grid
                        spacing={2}
                        columns={{ xs: 4, sm: 8, md: 12 }}
                    >
                        <Grid container rowspacing={3}>
                            <RadioGroup horizontal>
                                <RadioButton  rootColor="Gray" value="Multiple" iconSize={20}>
                                    and
                                </RadioButton>
                                <RadioButton  rootColor="Gray" value="Single" iconSize={20}>
                                    or
                                </RadioButton>
                            </RadioGroup>
                        </Grid>
                        <Grid>
                        <TabContext value={this.state.responseType}>
                            <Box
                                sx={{ borderBottom: 1, borderColor: "divider" }}
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
                                                            value={val.fname}
                                                            onChange={(e) => handleChange(e, i)}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={7}>
                                                        <this.MyComponent
                                                            name="tab"
                                                            value={val.lname}
                                                            onChange={(e) => handleChange(e, i)}
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
                            </TabPanel>
                            <TabPanel value="3">
                                <Grid container spacing={3}>
                                <Grid item xs={2}>
                                        <RadioGroup horizontal   >
                                            <RadioButton rootColor="Gray" value="OR" iconSize={20}>
                                                or
                                            </RadioButton>
                                            <RadioButton rootColor="Gray" value="AMD" iconSize={20}>
                                                and
                                            </RadioButton>
                                        </RadioGroup>
                                </Grid>
                                </Grid>
                            </TabPanel>
                            <TabPanel value="4">


                            </TabPanel>
                                        

                            
                            
                        </TabContext>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        );
    };

    /*
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
    };*/

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
                <this.Partclassification />
                <this.PartTags />
                <this.PartOptions />
                <this.Partpayloads />
                <this.PartFuzzing />
                <this.PartMatchers />
            </Container>
        );
    }
}
