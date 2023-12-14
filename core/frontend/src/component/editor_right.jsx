import * as React from "react";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";

import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import Stack from "@mui/material/Stack";

import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import "../assets/css/editor_top_right.css";
import { html_beautify } from "js-beautify";

export default class Editor_Right extends React.Component {
    constructor(props) {
        super(props);

        this.state = { httpmethod: "GET", responseViwerType: "1" };
    }

    // Top Part
    handleRequestMethodChange = (method) => {
        if (method.target.value != this.state.httpmethod) {
            console.log();
            this.setState({
                httpmethod: method.target.value,
            });
        }
    };
    selectRequestMethod = () => {
        return (
            <Select
                sx={{ borderRadius: "4px 0 0 4px", minWidth: 120 }}
                value={this.state.httpmethod}
                onChange={this.handleRequestMethodChange}
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
            >
                <MenuItem value="GET">GET</MenuItem>
                <MenuItem value="POST">POST</MenuItem>
                <MenuItem value="PUT">PUT</MenuItem>
                <MenuItem value="DELETE">DELETE</MenuItem>
            </Select>
        );
    };

    //Bottom Part
    requestFlowLine = () => {
        return (
            <List
                sx={{
                    width: "100%",
                    maxWidth: 360,
                    bgcolor: "background.paper",
                    position: "relative",
                    overflow: "auto",
                    maxHeight: 300,
                    "& ul": { padding: 0 },
                }}
                subheader={<li />}
            >
                {[0, 1, 2, 3, 4].map((sectionId) => (
                    <li key={`section-${sectionId}`}>
                        <ul>
                            <ListSubheader>{`I'm sticky ${sectionId}`}</ListSubheader>
                            {[0, 1, 2].map((item) => (
                                <ListItem key={`item-${sectionId}-${item}`}>
                                    <ListItemText primary={`Item ${item}`} />
                                </ListItem>
                            ))}
                        </ul>
                    </li>
                ))}
            </List>
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

    render() {
        console.log(html_beautify(this.state.tmpdata));
        return (
            <div>
                <Stack
                    direction="row"
                    spacing={0}
                    alignItems="center"
                    justifyContent="center"
                >
                    <this.selectRequestMethod />
                    <TextField
                        fullWidth
                        label="fullWidth"
                        id="fullWidth"
                        sx={{ borderRadius: "0", minWidth: 120 }}
                    />
                    <Button
                        variant="contained"
                        endIcon={<SendIcon />}
                        sx={{ borderRadius: "0 4px 4px 0", height: "56px" }}
                        size="large"
                    >
                        Send
                    </Button>
                </Stack>
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
                        {html_beautify(this.state.tmpdata)}
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
            </div>
        );
    }
}
