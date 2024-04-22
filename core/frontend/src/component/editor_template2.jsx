import * as React from "react";

import { Container } from "@mui/material";

import "../assets/css/editor.css";
import { CodeBlock, dracula } from "react-code-blocks";

import Grid from "@mui/joy/Grid";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Divider from "@mui/joy/Divider";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Typography from "@mui/joy/Typography";
import Tooltip from "@mui/joy/Tooltip";
import Button from "@mui/joy/Button";
import Autocomplete from "@mui/joy/Autocomplete";
import AutocompleteOption from "@mui/joy/AutocompleteOption";
import ListItemContent from "@mui/joy/ListItemContent";
import Table from "@mui/joy/Table";
import DeleteIcon from "@mui/icons-material/Delete";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

import {
    CustomAutocomplete,
    CustomAutocompleteMC,
    CustomAutocompleteFreeMC,
    CustomAutocompleteFree,
    PartAutocompleteMC,
    ExtractorAutocomplete,
    CustomSelectionBox,
    ConditionRadioButtons,
    CustomSwitchButtons,
    CustomTextInputBox,
    CustomTextareaInputBox,
    ControlledDropdown,
    GroupControlledDropdown,
    CustomCard,
    CustomRadioButtonsForAttack,
} from "./editor_components";
import { formatDescription } from "./editor_components";
import DiskplayOptions from "./editor_options_list";

// icon
import AddIcon from "@mui/icons-material/Add";

import globeVar from "../../GlobalVar";

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
function firstCharToUpper(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function generateString(length) {
    let result = " ";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export default class EditorTemplate extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            firstRun: true,
            cveOpt: [],
            tagsOpt: [],
            userinput: {},
            attack: "clusterbomb",
            payloadCounter: 0,
            httpRequestOptionCounter: 0,
            matchersConditionCounter: 0,
            matchersCondition: "or",
            info_optional_list: [
                {
                    label: "impact",
                    description: "Impact of the template",
                    descriptionlink: "https://mui.com/joy-ui/react-tooltip/",
                    component: CustomTextareaInputBox,
                    enabled: false,
                },
                {
                    label: "remediation",
                    description: "You can go in-depth here on how to mitigate the problem found by this template.",
                    descriptionlink: "https://mui.com/joy-ui/react-tooltip/",
                    component: CustomTextareaInputBox,
                    enabled: false,
                },
                {
                    label: "reference",
                    description:
                        "Reference is another popular tag to define external reference links for the template.",
                    descriptionlink: "https://mui.com/joy-ui/react-tooltip/",
                    component: CustomTextInputBox,
                    enabled: false,
                },
            ],
            variables_optional_list: [],
            classification_optional_list: [
                {
                    label: "cvss-metrics",
                    description:
                        "CVSS Metrics for the template. \n\nExamples: cvss-metrics: 3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H",
                    descriptionlink: "https://mui.com/joy-ui/react-tooltip/",
                    component: CustomTextInputBox,
                    enabled: false,
                },
                {
                    label: "cvss-score",
                    description: "CVSS Score for the template. \n\nExamples: cvss-score: 9.8",
                    descriptionlink: "https://mui.com/joy-ui/react-tooltip/",
                    component: CustomTextInputBox,
                    enabled: false,
                },
                {
                    label: "cpe",
                    description: "CPE for the template. \n\nExamples: cpe: cpe:/a:vendor:product:version",
                    descriptionlink: "https://mui.com/joy-ui/react-tooltip/",
                    component: CustomTextInputBox,
                    enabled: false,
                },
                {
                    label: "epss-score",
                    description: "EPSS Score for the template.\n\nExamples: epss-score: 0.42509",
                    descriptionlink: "https://mui.com/joy-ui/react-tooltip/",
                    component: CustomTextInputBox,
                    enabled: false,
                },
                {
                    label: "epss-percentile",
                    description: "EPSS Percentile for the template. \n\nExamples: epss-percentile: 0.42509",
                    descriptionlink: "https://mui.com/joy-ui/react-tooltip/",
                    component: CustomTextInputBox,
                    enabled: false,
                },
            ],
            http_request_optional_list: DiskplayOptions.http_request_opts,
            matchers_optional_list: DiskplayOptions.matchers_opts,
            payload_optional_list: [],
            extractors_optional_list: DiskplayOptions.extractors_opts,
        };

        this.matchersPartOpts = DiskplayOptions.matchersPart_opts;
    }

    fetchCveData = async () => {
        try {
            const data = await (
                await fetch(`${globeVar.backendprotocol}://${globeVar.backendhost}/cve/search`, {
                    signal: AbortSignal.timeout(8000),
                    method: "POST",
                    body: JSON.stringify({
                        keyword: "CVE-2023",
                    }),
                })
            ).json();
            const list = [];
            data.result.map((item) => {
                list.push({ label: item.CveMetadata.CveID });
            });
            if (this.state.cveOpt.length != list.length) {
                console.log(list);
                this.setState({ cveOpt: list, firstRun: false });
            }
            return list;
        } catch (error) {
            console.log("backend server error");
            return [];
        }
    };
    fetchTagsData = async () => {
        try {
            const data = await (
                await fetch(`${globeVar.backendprotocol}://${globeVar.backendhost}/tag/all`, {
                    signal: AbortSignal.timeout(8000),
                    method: "POST",
                })
            ).json();
            if (this.state.tagsOpt.length != data.length) {
                this.setState({ tagsOpt: data });
            }
            return data.result;
        } catch (error) {
            console.log("backend server error");
            return [];
        }
    };

    // Event Handler for User Input Fields (save to database)
    onchange_information = (key, value) => {
        const old = this.state.userinput;
        if (old["info"] === undefined) {
            old["info"] = {};
        }
        if (key != "reference") {
            old["info"][key] = value;
        } else {
            old["info"][key] = [value];
        }
        this.setState({ userinput: old });
    };
    onchange_classification = (key, value) => {
        const old = this.state.userinput;
        if (old["info"] === undefined) {
            old["info"] = {};
        }
        if (old["info"]["classification"] === undefined) {
            old["info"]["classification"] = {};
        }

        if (key == "cvss-score" || key == "cvss-score") {
            if (isNumeric(value)) {
                old["info"]["classification"][key] = parseFloat(value);
            } else {
            }
        } else if (key == "cve-id") {
            old["info"]["classification"][key] = value.label;
        } else {
            old["info"]["classification"][key] = value;
        }

        console.log(old["info"]["classification"]);
        this.setState({ userinput: old });
    };
    onchange_http = (key, value) => {
        const old = this.state.userinput;
        if (old["http"] === undefined) {
            old["http"] = {};
        }
        old["http"][key] = value;
        this.setState({ userinput: old });
    };

    // Event Handler for User Input Fields (show/hide)
    onchange_information_option = (key) => {
        const old = this.state.info_optional_list;
        old[key].enabled = !old[key].enabled;
        this.setState({ info_optional_list: old });
    };
    onchange_classification_option = (key) => {
        const old = this.state.classification_optional_list;
        old[key].enabled = !old[key].enabled;
        this.setState({ classification_optional_list: old });
    };
    onchange_matchers_option = (key) => {
        const old = [...this.state.matchers_optional_list];
        var mcc = this.state.matchersConditionCounter;
        if (key > 6) {
            // delete old[key];
            old[key].enabled = !old[key].enabled;
            if (old[key].enabled) {
                mcc++;
            } else {
                mcc--;
            }
        } else {
            const taget = { ...old[key] };
            old.push(taget);
            old[old.length - 1].enabled = true;
            mcc++;
        }
        this.setState({ matchers_optional_list: old, matchersConditionCounter: mcc });
    };
    onchange_extractors_option = (key) => {
        const old = [...this.state.extractors_optional_list];
        if (key > 4) {
            // delete old[key];
            old[key].enabled = !old[key].enabled;
        } else {
            const taget = { ...old[key] };
            old.push(taget);
            old[old.length - 1].enabled = true;
        }
        this.setState({ extractors_optional_list: old });
    };

    // Variables Change Handler
    onchange_variables_option = (key) => {
        const old = this.state.variables_optional_list;
        old[key].enabled = !old[key].enabled;
        console.log(old);
        this.setState({
            variables_optional_list: old,
        });
    };
    onTableChange_variables_option = (key, local, value) => {
        const old = this.state.variables_optional_list;
        old[key][local] = value;
        console.log(old);
        this.setState({
            variables_optional_list: old,
        });
    };
    onXchange_variables_option = () => {
        const old = this.state.variables_optional_list;
        old.push({
            enabled: true,
            label: "",
            value: "",
        });

        this.setState({
            variables_optional_list: old,
        });
    };

    // Request Change Handler
    onchange_http_request_option = (key) => {
        const old = this.state.http_request_optional_list;
        var newHROC = 0;
        old.common[key].enabled = !old.common[key].enabled;
        if (old.common[key].enabled) {
            newHROC = this.state.httpRequestOptionCounter + 1;
        } else {
            newHROC = this.state.httpRequestOptionCounter - 1;
        }
        this.setState({
            http_request_optional_list: old,
            httpRequestOptionCounter: newHROC,
        });
    };
    onXchange_http_request_option = (type) => {
        const old = this.state.http_request_optional_list;
        var newHROC = this.state.httpRequestOptionCounter + 1;
        if (type == "array") {
            old.common.push({
                label: "a_" + generateString(5),
                description: "http_request_option",
                component: Input,
                enabled: true,
                value: "",
                issuer: "custom",
                type: type,
            });
        } else {
            old.common.push({
                label: "",
                description: "http_request_option",
                component: Input,
                enabled: true,
                value: "",
                issuer: "custom",
                type: type,
            });
        }

        this.setState({
            http_request_optional_list: old,
            httpRequestOptionCounter: newHROC,
        });
    };
    onTableChange_http_request_option = (key, local, value) => {
        const old = this.state.http_request_optional_list;
        old.common[key][local] = value;
        this.setState({
            http_request_optional_list: old,
        });
    };
    remove_http_request_option = (key) => {
        const old = this.state.http_request_optional_list;
        delete old.common[key];
        this.setState({
            http_request_optional_list: old,
            httpRequestOptionCounter: this.state.httpRequestOptionCounter - 1,
        });
    };
    reset_http_request_option = (key) => {
        const old = this.state.http_request_optional_list;
        old.common[key].value = "";
        old.common[key].enabled = false;
        this.setState({
            http_request_optional_list: old,
            httpRequestOptionCounter: this.state.httpRequestOptionCounter - 1,
        });
    };
    format_http_request = () => {
        var txt = "";
        var last = "";
        this.state.http_request_optional_list;
        for (let x in this.state.http_request_optional_list.common) {
            let s = this.state.http_request_optional_list.common[x];
            if (s.enabled) {
                if (s.issuer == "custom" && s.type == "array") {
                    last += "\n" + s.value + "\n";
                } else {
                    txt += s.label + ": " + s.value + "\n";
                }
            }
        }
        return txt + last;
    };

    // Matchers Change Handler
    onXchange_matchers_option = (key, local, value) => {
        const old = this.state.matchers_optional_list;
        old[key][local] = value;
        console.log(old);
        this.setState({
            matchers_optional_list: old,
        });
    };
    onChangeMatcherCondition = (key, local, value) => {
        this.setState({ matchersCondition: value });
    };

    // payload Change Handler
    onchange_payload_option = (key) => {
        const old = this.state.payload_optional_list;
        var newHROC;
        old[key].enabled = !old[key].enabled;
        console.log(old);
        if (old[key].enabled) {
            newHROC = this.state.payloadCounter + 1;
        } else {
            newHROC = this.state.payloadCounter - 1;
        }
        if (newHROC > 1 && attack == "batteringram") {
            this.setState({
                payload_optional_list: old,
                payloadCounter: newHROC,
                attack: "clusterbomb",
            });
        } else {
            this.setState({
                payload_optional_list: old,
                payloadCounter: newHROC,
            });
        }
    };
    onTableChange_payload_option = (key, local, value) => {
        const old = this.state.payload_optional_list;
        old[key][local] = value;
        console.log(old);
        this.setState({
            payload_optional_list: old,
        });
    };
    onXchange_payload_option = () => {
        const old = this.state.payload_optional_list;
        old.push({
            enabled: true,
            label: "",
            value: "",
        });

        this.setState({
            payload_optional_list: old,
        });
    };
    onchange_attack_option = (value) => {
        this.setState({
            attack: value,
        });
    };

    // Extractors Change Handler
    onXchange_Extractors_option = (key, local, value) => {
        const old = this.state.extractors_optional_list;
        old[key][local] = value;
        console.log(old);
        this.setState({
            extractors_optional_list: old,
        });
    };

    saveToDataBase = () => {
        const user_input = {};

        // info
        if (this.state.userinput.hasOwnProperty("info")) {
            user_input["info"] = { ...this.state.userinput.info };

            if (user_input["info"].hasOwnProperty("tags")) {
                var tmpstr = "";
                this.state.userinput.info.tags.map((value) => {
                    tmpstr += value.name + ",";
                });
                user_input["info"]["tags"] = tmpstr.slice(0, -1);
            }
        }

        // variables
        user_input["variables"] = {};
        for (let x in this.state.matchers_optional_list) {
            if (x.enabled) {
                user_input["variables"][x.label] = x.value;
            }
        }
        if (user_input["variables"].length == 0) {
            delete user_input.variables;
        }

        // http request
        user_input["http"] = [{}];
        if (
            this.state.userinput.hasOwnProperty("info") &&
            this.state.userinput.hasOwnProperty("http") &&
            this.state.userinput.http.hasOwnProperty("method")
        ) {
            if (this.state.httpRequestOptionCounter < 2 && this.state.userinput.http.method == "GET") {
                user_input["http"][0] = {
                    method: this.state.userinput.http.method,
                    path: [this.state.userinput.http.path],
                };
            } else {
                let http_raw_request = this.format_http_request();
                user_input["http"][0] = {
                    raw: [http_raw_request],
                };
            }
        } else {
        }

        // payload
        user_input["http"][0]["payloads"] = {};
        for (let x in this.state.payload_optional_list) {
            console.log(this.state.payload_optional_list[x]);
            if (this.state.payload_optional_list[x].enabled) {
                user_input["http"][0]["payloads"][this.state.payload_optional_list[x].label] =
                    this.state.payload_optional_list[x].value;
            }
        }

        console.log(user_input["http"][0]["payloads"]);
        if (user_input["http"][0]["payloads"].length == 0) {
            delete user_input["http"][0].payload;
        }

        // Matchers
        if (this.state.matchersConditionCounter > 1 && this.state.matchersCondition != "") {
            user_input["http"][0]["matchers-condition"] = this.state.matchersCondition;
        }

        // Matchers formatting
        user_input["http"][0]["matchers"] = [];
        for (let x in this.state.matchers_optional_list) {
            const t = this.state.matchers_optional_list[x];
            if (t.enabled) {
                const matcherCO = {};

                if (t.label != "words") {
                    matcherCO["type"] = t.label;
                } else {
                    matcherCO["type"] = "word";
                }
                if (t.label !== "status") {
                    if (t.part != "") {
                        matcherCO["part"] = t.part;
                    }
                    if (t[t.label].length > 1) {
                        matcherCO["condition"] = t.condition;
                    }
                }

                if (t["isInternal"]) {
                    matcherCO["negative"] = t.isNegative;
                }
                if (t["isInternal"]) {
                    matcherCO["internal"] = t.isInternal;
                }

                matcherCO[t.label] = t[t.label];

                user_input["http"][0]["matchers"].push(matcherCO);
            }
        }

        // Extractors formatting
        user_input["http"][0]["extractors"] = [];
        for (let x in this.state.extractors_optional_list) {
            const j = this.state.extractors_optional_list[x];
            if (j.enabled) {
                const extractorCO = {};
                extractorCO["type"] = j.label;
                if (j.label !== "dsl") {
                    if (j.part != "") {
                        extractorCO["part"] = j.part;
                    }
                }
                if (j.label == "xpath") {
                    if (j.part != "") {
                        extractorCO["attribute"] = j.attribute;
                    }
                }
                if (j.label == "regex" || j.label == "json") {
                    if (j.group != "") {
                        extractorCO["group"] = j.group;
                    }
                }
                extractorCO[j.label] = j[j.label];
                user_input["http"][0]["extractors"].push(extractorCO);
            }
        }

        // console.log(this.state.extractors_optional_list);
        this.props.onChange(user_input);
    };

    render() {
        if (this.state.firstRun) {
            this.fetchCveData();
            this.fetchTagsData();
        }
        return (
            <Container maxWidth="lg" sx={{ mx: 0, px: 0 }}>
                <CustomCard
                    title={"Information"}
                    link={"https://google.com"}
                    description={"Info contains metadata information about a template"}
                >
                    <Grid xs={4}>
                        <CustomTextInputBox
                            label={"name"}
                            description={"Name should be good short summary that identifies what the template does."}
                            onChange={this.onchange_information}
                        ></CustomTextInputBox>
                    </Grid>
                    <Grid xs={4}>
                        <CustomTextInputBox
                            label={"author"}
                            description={"Author of the template."}
                            onChange={this.onchange_information}
                        ></CustomTextInputBox>
                    </Grid>
                    <Grid xs={4}>
                        <CustomSelectionBox
                            label={"severity"}
                            options={["info", "low", "medium", "high", "critical", ""]}
                            description={"severity include ifo,low,medium,high and critical."}
                            onChange={this.onchange_information}
                        ></CustomSelectionBox>
                    </Grid>

                    <Grid xs={12}>
                        <CustomAutocompleteMC
                            label={"tags"}
                            description={
                                "This allows you to set some custom tags to a template, depending on the purpose like cve, rce etc. This allows nuclei to identify templates with your input tags and only run them."
                            }
                            options={this.state.tagsOpt}
                            onChange={this.onchange_information}
                        ></CustomAutocompleteMC>
                    </Grid>
                    <Grid xs={12}>
                        <CustomTextareaInputBox
                            label={"description"}
                            description={"description"}
                            onChange={this.onchange_information}
                        ></CustomTextareaInputBox>
                    </Grid>

                    {this.state.info_optional_list.map((val, i) => {
                        if (val.enabled == true) {
                            return (
                                <Grid xs={12}>
                                    <val.component
                                        label={val.label}
                                        description={val.description}
                                        link={val.descriptionlink ? val.descriptionlink : ""}
                                        onChange={this.onchange_information}
                                    />
                                </Grid>
                            );
                        }
                    })}
                    <Grid xs={4}>
                        <ControlledDropdown
                            ukey={"information"}
                            options={this.state.info_optional_list}
                            onChange={this.onchange_information_option}
                        ></ControlledDropdown>
                    </Grid>
                </CustomCard>
                <CustomCard
                    title={"Classification"}
                    link={"https://google.com"}
                    description={"Info contains metadata information about a template"}
                >
                    <Grid xs={4}>
                        <CustomTextInputBox
                            label={"cwe-id"}
                            description={"CWE ID for the template. \n\nExamples: cwe-id: CWE-22"}
                            onChange={this.onchange_classification}
                        ></CustomTextInputBox>
                    </Grid>
                    <Grid xs={8}>
                        <CustomAutocomplete
                            label={"cve-id"}
                            options={this.state.cveOpt}
                            description={"CVE ID for the template. \n\nExamples: cve-id: CVE-2020-14420"}
                            onChange={this.onchange_classification}
                        ></CustomAutocomplete>
                    </Grid>
                    {this.state.classification_optional_list.map((val, i) => {
                        if (val.enabled == true) {
                            return (
                                <Grid xs={4}>
                                    <val.component
                                        label={val.label}
                                        description={val.description}
                                        link={val.descriptionlink ? val.descriptionlink : ""}
                                        onChange={this.onchange_classification}
                                    />
                                </Grid>
                            );
                        }
                    })}
                    <Grid xs={4}>
                        <ControlledDropdown
                            ukey={"classification"}
                            options={this.state.classification_optional_list}
                            onChange={this.onchange_classification_option}
                        ></ControlledDropdown>
                    </Grid>
                </CustomCard>
                <CustomCard
                    title={"Variables"}
                    link={"https://google.com"}
                    description={"Variable is a key-value pair of strings that can be used throughout template."}
                >
                    {this.state.variables_optional_list.length > 0 && (
                        <Grid xs={12} sx={{ py: 0 }}>
                            <Table borderAxis={"xBetween"}>
                                <thead>
                                    <tr>
                                        <th style={{ width: "25%" }}>Name</th>
                                        <th style={{ width: "63%" }}>Value</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.variables_optional_list.map((header, hi) => {
                                        if (header.enabled) {
                                            return (
                                                <tr key={"variablesrow" + hi}>
                                                    <th>
                                                        <Input
                                                            size="lg"
                                                            onBlur={(event) =>
                                                                this.onTableChange_variables_option(
                                                                    hi,
                                                                    "label",
                                                                    event.target.value
                                                                )
                                                            }
                                                        />
                                                    </th>
                                                    <td>
                                                        <Input
                                                            onBlur={(event) =>
                                                                this.onTableChange_variables_option(
                                                                    hi,
                                                                    "value",
                                                                    event.target.value
                                                                )
                                                            }
                                                            size="lg"
                                                        />
                                                    </td>
                                                    <td>
                                                        <Button
                                                            onClick={() => this.onchange_variables_option(hi)}
                                                            variant="plain"
                                                            color="danger"
                                                        >
                                                            <DeleteIcon />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            );
                                        }
                                    })}
                                </tbody>
                            </Table>
                        </Grid>
                    )}

                    <Grid xs={4}>
                        <Button
                            variant="outlined"
                            color="neutral"
                            startDecorator={<AddIcon />}
                            onClick={this.onXchange_variables_option}
                        >
                            Add Variable
                        </Button>
                    </Grid>
                </CustomCard>
                <CustomCard
                    title={"Payload"}
                    link={"https://google.com"}
                    description={
                        "Payloads support both key-values combinations where a list of payloads is provided, or optionally a single file can also be provided as payload which will be read on run-time."
                    }
                >
                    {this.state.payload_optional_list.length > 0 && (
                        <Grid xs={12} sx={{ py: 0 }}>
                            <Table borderAxis={"xBetween"}>
                                <thead>
                                    <tr>
                                        <th style={{ width: "25%" }}>Name</th>
                                        <th style={{ width: "63%" }}>Value</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.payload_optional_list.map((header, hi) => {
                                        if (header.enabled) {
                                            return (
                                                <tr key={"variablesrow" + hi}>
                                                    <th>
                                                        <Input
                                                            size="lg"
                                                            onBlur={(event) =>
                                                                this.onTableChange_payload_option(
                                                                    hi,
                                                                    "label",
                                                                    event.target.value
                                                                )
                                                            }
                                                        />
                                                    </th>
                                                    <td>
                                                        <Autocomplete
                                                            multiple
                                                            freeSolo
                                                            // id={props.label}
                                                            placeholder={header.label}
                                                            options={[
                                                                "Last input 1",
                                                                "Last input 2",
                                                                "Last input 3",
                                                                "Last input 4",
                                                                "Last input 5",
                                                            ]}
                                                            // getOptionLabel={(option) => option.label}
                                                            onChange={(event, newValue) => {
                                                                this.onTableChange_payload_option(
                                                                    hi,
                                                                    "value",
                                                                    newValue
                                                                );
                                                            }}
                                                            size="lg"
                                                        />
                                                    </td>
                                                    <td>
                                                        <Button
                                                            onClick={() => this.onchange_payload_option(hi)}
                                                            variant="plain"
                                                            color="danger"
                                                        >
                                                            <DeleteIcon />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            );
                                        }
                                    })}
                                </tbody>
                            </Table>
                        </Grid>
                    )}

                    <Grid xs={4}>
                        <Button
                            variant="outlined"
                            color="neutral"
                            startDecorator={<AddIcon />}
                            onClick={this.onXchange_payload_option}
                        >
                            Add Variable
                        </Button>
                    </Grid>

                    <Grid xs={12}>
                        <Typography
                            level="title-lg"
                            endDecorator={
                                <Tooltip
                                    title={
                                        "Attack is the type of payload combinations to perform.batteringram is inserts the same payload into all defined payload positions at once, pitchfork combines multiple payload sets and clusterbomb generates permutations and combinations for all payloads."
                                    }
                                    sx={{ maxWidth: 320 }}
                                    placement="right"
                                >
                                    <HelpOutlineIcon color="action" />
                                </Tooltip>
                            }
                        >
                            Attack mode
                        </Typography>
                    </Grid>
                    <Grid xs={12}>
                        <CustomRadioButtonsForAttack
                            value={this.state.attack}
                            options={this.state.payload_optional_list}
                            onChange={this.onchange_attack_option}
                        />
                    </Grid>
                </CustomCard>
                <CustomCard
                    title={"Request"}
                    link={"https://google.com"}
                    description={"Info contains metadata information about a template"}
                >
                    <Grid xs={4}>
                        <CustomSelectionBox
                            label={"method"}
                            description={"Request contains a http request to be made from a template"}
                            options={["GET", "POST"]}
                            onChange={this.onchange_http}
                        ></CustomSelectionBox>
                    </Grid>

                    {this.state.userinput.http &&
                        this.state.userinput.http.method &&
                        this.state.userinput.http.method == "GET" &&
                        this.state.httpRequestOptionCounter == 0 && (
                            <Grid xs={12}>
                                <CustomTextareaInputBox
                                    label={"path"}
                                    description={"Path of the template executed"}
                                    options={["GET", "POST"]}
                                    value={"{{BaseURL}}/"}
                                    onChange={this.onchange_http}
                                ></CustomTextareaInputBox>
                            </Grid>
                        )}
                    {this.state.userinput.http &&
                        this.state.userinput.http.method &&
                        (this.state.httpRequestOptionCounter > 0 || this.state.userinput.http.method == "POST") && (
                            <Grid xs={12}>
                                <Table borderAxis={"xBetween"}>
                                    <thead>
                                        <tr>
                                            <th style={{ width: "20%" }}>Header Name</th>
                                            <th>Header Value</th>
                                            <th style={{ width: "7%" }}></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.http_request_optional_list.common.map((header, hi) => {
                                            if (header.enabled) {
                                                if (header.issuer == "custom") {
                                                    return (
                                                        <tr key={header.label}>
                                                            <th scope="row">
                                                                {header.type == "object" && (
                                                                    <header.component
                                                                        size="lg"
                                                                        onBlur={(event) =>
                                                                            this.onTableChange_http_request_option(
                                                                                hi,
                                                                                "label",
                                                                                event.target.value
                                                                            )
                                                                        }
                                                                        defaultValue={
                                                                            this.state.http_request_optional_list
                                                                                .common[hi].label
                                                                        }
                                                                        ref={
                                                                            this.state.http_request_optional_list
                                                                                .common[hi].label
                                                                        }
                                                                    />
                                                                )}
                                                            </th>
                                                            <td sx={{ display: "flex" }}>
                                                                <header.component
                                                                    size="lg"
                                                                    onBlur={(event) =>
                                                                        this.onTableChange_http_request_option(
                                                                            hi,
                                                                            "value",
                                                                            event.target.value
                                                                        )
                                                                    }
                                                                    defaultValue={
                                                                        this.state.http_request_optional_list.common[hi]
                                                                            .value
                                                                    }
                                                                    ref={
                                                                        this.state.http_request_optional_list.common[hi]
                                                                            .value
                                                                    }
                                                                />
                                                            </td>
                                                            <td>
                                                                <Button
                                                                    onClick={() => this.remove_http_request_option(hi)}
                                                                    variant="plain"
                                                                    color="danger"
                                                                >
                                                                    <DeleteIcon />
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    );
                                                } else {
                                                    return (
                                                        <tr key={header.label}>
                                                            <th scope="row">
                                                                <FormLabel>
                                                                    {header.label}
                                                                    <Tooltip
                                                                        title={formatDescription(header)}
                                                                        placement="right"
                                                                        sx={{
                                                                            maxWidth: 320,
                                                                            zIndex: 20,
                                                                            ml: 1,
                                                                        }}
                                                                    >
                                                                        <HelpOutlineIcon color="action" />
                                                                    </Tooltip>
                                                                </FormLabel>
                                                            </th>
                                                            <td>
                                                                <header.component
                                                                    onBlur={(event) =>
                                                                        this.onTableChange_http_request_option(
                                                                            hi,
                                                                            "value",
                                                                            event.target.value
                                                                        )
                                                                    }
                                                                    size="lg"
                                                                />
                                                            </td>
                                                            <td>
                                                                <Button
                                                                    onClick={() => this.reset_http_request_option(hi)}
                                                                    variant="plain"
                                                                    color="danger"
                                                                >
                                                                    <DeleteIcon />
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    );
                                                }
                                            }
                                        })}
                                    </tbody>
                                </Table>
                            </Grid>
                        )}

                    {this.state.userinput.http && this.state.userinput.http.method && (
                        <Grid xs={4}>
                            <GroupControlledDropdown
                                ukey={"http_request"}
                                options={this.state.http_request_optional_list}
                                onXChange={this.onXchange_http_request_option}
                                onChange={this.onchange_http_request_option}
                            ></GroupControlledDropdown>
                        </Grid>
                    )}

                    {this.state.userinput.http &&
                        this.state.userinput.http.method &&
                        (this.state.httpRequestOptionCounter > 0 || this.state.userinput.http.method == "POST") && (
                            <Grid xs={12}>
                                <Divider sx={{ my: 1 }} />
                                <Typography level="body" Output></Typography>

                                <CodeBlock
                                    text={this.format_http_request()}
                                    language="go"
                                    showLineNumbers={false}
                                    theme={dracula}
                                />
                            </Grid>
                        )}
                </CustomCard>
                <CustomCard
                    title={"Matchers"}
                    link={"https://google.com"}
                    description={"Info contains metadata information about a template"}
                >
                    {this.state.matchersConditionCounter > 1 && (
                        <Grid xs={12}>
                            <ConditionRadioButtons
                                value={this.state.matchersCondition}
                                options={["or", "and"]}
                                onChange={this.onChangeMatcherCondition}
                                ikey={0}
                            />
                            <Divider inset="none" />
                        </Grid>
                    )}
                    {this.state.matchers_optional_list.map((val, i) => {
                        if (val.enabled == true) {
                            return (
                                <Grid xs={6}>
                                    <Card key={"matchers_type_" + i + val.label} variant="soft" sx={{ w: "100%" }}>
                                        <Typography
                                            level="title-lg"
                                            endDecorator={
                                                <Tooltip
                                                    title={val.description}
                                                    sx={{ maxWidth: 320 }}
                                                    placement="right"
                                                >
                                                    <HelpOutlineIcon color="action" />
                                                </Tooltip>
                                            }
                                        >
                                            {firstCharToUpper(val.label)}
                                        </Typography>
                                        <Divider inset="none" />
                                        <CardContent>
                                            <Grid sx={{ p: 0, mb: 1 }}>
                                                <CustomSwitchButtons
                                                    label={"Internal Matchers"}
                                                    description={
                                                        "When writing multi-protocol or flow based templates, there might be a case where we need to validate/match first request then proceed to next request"
                                                    }
                                                    value={val.isInternal}
                                                    onChange={this.onXchange_matchers_option}
                                                    ikey={i}
                                                    local={"isInternal"}
                                                ></CustomSwitchButtons>
                                                <CustomSwitchButtons
                                                    label={"Negative Matchers"}
                                                    description={
                                                        "All types of matchers also support negative conditions, mostly useful when you look for a match with an exclusions"
                                                    }
                                                    value={val.isNegative}
                                                    onChange={this.onXchange_matchers_option}
                                                    ikey={i}
                                                    local={"isNegative"}
                                                ></CustomSwitchButtons>
                                            </Grid>
                                            <Divider />
                                            <Grid sx={{ p: 0, mb: 0 }}>
                                                {val.label != "status" && (
                                                    <PartAutocompleteMC
                                                        ikey={i}
                                                        label={"part"}
                                                        description={"Select the part of the request"}
                                                        options={this.matchersPartOpts}
                                                        onChange={this.onXchange_matchers_option}
                                                    />
                                                )}
                                                <ConditionRadioButtons
                                                    value={val.condition}
                                                    options={val.conditionOptions}
                                                    onChange={this.onXchange_matchers_option}
                                                    ikey={i}
                                                />
                                            </Grid>
                                            <Divider />
                                            {val.label == "status" && (
                                                <Grid container marginTop={1}>
                                                    <Autocomplete
                                                        multiple
                                                        freeSolo
                                                        disableClearable
                                                        id={val.label}
                                                        placeholder={val.label}
                                                        options={val.valueOption}
                                                        getOptionLabel={(option) => {
                                                            return typeof option == "string"
                                                                ? option
                                                                : option.code + " - " + option.label;
                                                        }}
                                                        onChange={(event, newValue) => {
                                                            const tmparray = [];
                                                            newValue.forEach((xval, xi) => {
                                                                if (typeof xval == "string") {
                                                                    if (!tmparray.includes(parseInt(xval))) {
                                                                        tmparray.push(parseInt(xval));
                                                                    }
                                                                } else {
                                                                    if (!tmparray.includes(xval.code)) {
                                                                        tmparray.push(xval.code);
                                                                    }
                                                                }
                                                            });
                                                            this.onXchange_matchers_option(i, val.label, tmparray);
                                                        }}
                                                        renderOption={(props, option) => (
                                                            <AutocompleteOption {...props}>
                                                                <ListItemContent sx={{ fontSize: "sm" }}>
                                                                    {option.code + " - " + option.label}
                                                                    <Typography level="body-xs">
                                                                        {option.description}
                                                                    </Typography>
                                                                </ListItemContent>
                                                            </AutocompleteOption>
                                                        )}
                                                        size="lg"
                                                        sx={{ width: "100%" }}
                                                    />
                                                </Grid>
                                            )}
                                            {val.label != "status" && (
                                                <CustomAutocompleteFreeMC
                                                    label={val.label}
                                                    description={val.description}
                                                    link={val.descriptionlink ? val.descriptionlink : ""}
                                                    onChange={this.onXchange_matchers_option}
                                                    ikey={i}
                                                ></CustomAutocompleteFreeMC>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            );
                        }
                    })}
                    <Grid xs={4}>
                        <ControlledDropdown
                            ukey={"matchers"}
                            options={this.state.matchers_optional_list}
                            onChange={this.onchange_matchers_option}
                        ></ControlledDropdown>
                    </Grid>
                </CustomCard>
                <CustomCard
                    title={"Extractors"}
                    link={"https://google.com"}
                    description={
                        "Extractors can be used to extract and display in results a match from the response returned by a module."
                    }
                >
                    {this.state.extractors_optional_list.map((val, i) => {
                        if (val.enabled == true) {
                            return (
                                <Grid xs={6}>
                                    <Card key={"matchers_type_" + i + val.label} variant="soft" sx={{ w: "100%" }}>
                                        <Typography
                                            level="title-lg"
                                            endDecorator={
                                                <Tooltip
                                                    title={val.description}
                                                    sx={{ maxWidth: 320 }}
                                                    placement="right"
                                                >
                                                    <HelpOutlineIcon color="action" />
                                                </Tooltip>
                                            }
                                        >
                                            {firstCharToUpper(val.label)}
                                        </Typography>
                                        <Divider inset="none" />
                                        <CardContent>
                                            <Grid sx={{ p: 0, mb: 1 }}>
                                                <CustomSwitchButtons
                                                    label={"Dynamic Extractor"}
                                                    description={
                                                        "If you want to use extractor as a dynamic variable, you must enable this to avoid printing extracted values in the terminal."
                                                    }
                                                    value={val.isInternal}
                                                    onChange={this.onXchange_Extractors_option}
                                                    ikey={i}
                                                    local={"isInternal"}
                                                ></CustomSwitchButtons>
                                            </Grid>
                                            <Divider />
                                            <Grid sx={{ p: 0, mb: 0 }}>
                                                <CustomAutocompleteFree
                                                    ikey={i}
                                                    label={"name"}
                                                    description={
                                                        "Name is the optional name of the request.If a name is specified, all the named request in a template can be matched upon in a combined manner allowing multi-request based matchers."
                                                    }
                                                    options={[
                                                        "Last input 1",
                                                        "Last input 2",
                                                        "Last input 3",
                                                        "Last input 4",
                                                        "Last input 5",
                                                    ]}
                                                    onChange={this.onXchange_Extractors_option}
                                                ></CustomAutocompleteFree>
                                                {val.label != "dsl" && (
                                                    <PartAutocompleteMC
                                                        ikey={i}
                                                        label={"part"}
                                                        description={"Select the part of the request"}
                                                        options={this.matchersPartOpts}
                                                        onChange={this.onXchange_Extractors_option}
                                                    />
                                                )}
                                                {(val.label == "regex" || val.label == "json") && (
                                                    <CustomAutocompleteFree
                                                        ikey={i}
                                                        label={"group"}
                                                        description={
                                                            "group defines the matching group being used.In GO the 'match' is the full array of all matches and submatches.match[0] is the full match.match[n] is the submatches. Most often we'd want match[1] as depicted below"
                                                        }
                                                        options={[
                                                            "Last input 1",
                                                            "Last input 2",
                                                            "Last input 3",
                                                            "Last input 4",
                                                            "Last input 5",
                                                        ]}
                                                        onChange={this.onXchange_Extractors_option}
                                                    />
                                                )}
                                            </Grid>
                                            <Divider sx={{ my: 2 }} />
                                            {val.label == "xpath" && (
                                                <CustomAutocompleteFree
                                                    ikey={i}
                                                    label={"attribute"}
                                                    description={
                                                        "XPath are the xpath queries expressions that will be evaluated against the response part."
                                                    }
                                                    options={[
                                                        "Last input 1",
                                                        "Last input 2",
                                                        "Last input 3",
                                                        "Last input 4",
                                                        "Last input 5",
                                                    ]}
                                                    onChange={this.onXchange_Extractors_option}
                                                />
                                            )}
                                            <CustomAutocompleteFreeMC
                                                ikey={i}
                                                label={val.label}
                                                description={val.description}
                                                options={this.matchersPartOpts}
                                                onChange={this.onXchange_Extractors_option}
                                            ></CustomAutocompleteFreeMC>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            );
                        }
                    })}
                    <Grid xs={4}>
                        <ControlledDropdown
                            ukey={"extractors"}
                            options={this.state.extractors_optional_list}
                            onChange={this.onchange_extractors_option}
                        ></ControlledDropdown>
                    </Grid>
                </CustomCard>
                <Grid>
                    <Button onClick={this.saveToDataBase}>Save</Button>
                </Grid>
            </Container>
        );
    }
}
