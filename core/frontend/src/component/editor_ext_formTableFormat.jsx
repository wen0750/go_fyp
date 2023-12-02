import React, { Component, useState } from "react";

import { useTheme, createTheme, ThemeProvider } from "@mui/material/styles";
import {
    Box,
    Button,
    TextField,
    Menu,
    MenuItem,
    IconButton,
    OutlinedInput,
    InputLabel,
    InputAdornment,
    ListItemIcon,
    FormControl,
    textFieldClasses,
    Typography,
} from "@mui/material";

import { Autocomplete } from "@mui/material";

import Grid from "@mui/material/Unstable_Grid2";
import DeleteIcon from "@mui/icons-material/Delete";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import Check from "@mui/icons-material/Check";
import SigleSelect from "./editor_ext_selector";
import globeVar from "../../GlobalVar";

export default class FormTableFormat extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            anchorEl: null,
            open: false,
            cveOpen: false,
            cveOpt: false,
            removableBtn: null,
            optionalItemList: this.props.opts.filter(function (item) {
                return item.visible == false && item.removable == true;
            }),
        };

        this.handleOnChange = (event) => {
            this.props.callback(
                this.props.catalog,
                event.target.name,
                event.target.value
            );
        };
        this.defaultTheme = createTheme();
        this.theme = createTheme({
            components: {
                MuiButton: {
                    variants: [
                        {
                            props: { variant: "solid" },
                            style: {
                                textTransform: "none",
                                border: `2px solid ${this.defaultTheme.palette.primary.main}`,
                                color: this.defaultTheme.palette.primary.main,
                                width: "222.4px",
                            },
                        },
                    ],
                },
            },
        });
    }

    // fatch data
    fetchTagData = async () => {
        try {
            const response = await fetch(
                `${globeVar.backendprotocol}://${globeVar.backendhost}/tag/file`,
                {
                    signal: AbortSignal.timeout(8000),
                    method: "POST",
                }
            );
        } catch (error) {
            console.log("backend server error");
            return [];
        }
    };

    searchCveData = async (indata) => {
        if (indata.length < 1) {
            this.fetchCveData();
        } else {
            try {
            } catch (error) {}
        }
    };

    fetchCveData = async () => {
        try {
            const data = await (
                await fetch(
                    `${globeVar.backendprotocol}://${globeVar.backendhost}/cve/lists`,
                    {
                        signal: AbortSignal.timeout(8000),
                        method: "POST",
                    }
                )
            ).json();
            console.log(data.result);
            if (data.result == null) {
                data.result = [];
            }
            if (this.state.cveOpt != data.result) {
                this.setState({ cveOpt: data.result });
            }
            return data.result;
        } catch (error) {
            console.log("backend server error");
            return [];
        }
    };
    searchCveData = async (indata) => {
        if (indata.length < 1) {
            this.fetchCveData();
        } else {
            try {
                const data = await (
                    await fetch(
                        `${globeVar.backendprotocol}://${globeVar.backendhost}/cve/search`,
                        {
                            signal: AbortSignal.timeout(8000),
                            method: "POST",
                            body: JSON.stringify({
                                keyword: indata,
                            }),
                        }
                    )
                ).json();
                console.log(data.result);
                this.setState({ cveOpt: data.result });
                return data.result;
            } catch (error) {
                console.log("backend server error");
                return [];
            }
        }
    };

    findOptionalItemIndex = (key) => {
        return this.state.optionalItemList.findIndex((item) => item.key == key);
    };

    optsBtn = () => {
        return (
            <Grid sx={{ width: 1 / 3 }}>
                <FormControl
                    variant="outlined"
                    sx={{ width: 1, height: "56px" }}
                >
                    <ThemeProvider theme={this.theme} sx={{ width: 1 }}>
                        <Button
                            id="basiceee-button"
                            aria-controls={
                                this.state.open ? "basic-menu" : undefined
                            }
                            aria-haspopup="true"
                            aria-expanded={this.state.open ? "true" : undefined}
                            onClick={this.optsBtnMenu_open}
                            variant="solid"
                            sx={{ width: 1, height: 1 }}
                        >
                            <AddRoundedIcon />
                        </Button>
                    </ThemeProvider>
                </FormControl>
                {this.state.open ? <this.optsBtnMenu /> : ""}
            </Grid>
        );
    };
    optsBtnMenu = () => {
        return (
            <Menu
                anchorEl={this.state.anchorEl}
                open={this.state.open}
                onClose={this.optsBtnMenu_close}
                MenuListProps={{
                    "aria-labelledby": "basic-button",
                }}
            >
                {this.state.optionalItemList.map((data) => {
                    return (
                        <MenuItem
                            ket={data.key}
                            data-key={data.key}
                            onClick={this.optsBtnMenuOpt_click}
                        >
                            {data.label}
                            {data.visible === false &&
                            data.removable === true ? null : (
                                <ListItemIcon>
                                    <Check />
                                </ListItemIcon>
                            )}
                        </MenuItem>
                    );
                })}
            </Menu>
        );
    };
    optsBtnMenu_open = (event) => {
        this.setState({ anchorEl: event.currentTarget, open: true });
    };
    optsBtnMenu_close = () => {
        this.setState({ anchorEl: null, open: false });
    };
    optsBtnMenuOpt_click = (e) => {
        let datakey = e.currentTarget.getAttribute("data-key");
        let itemIndex = this.findOptionalItemIndex(datakey);
        if (this.state.optionalItemList[itemIndex].visible === false) {
            this.removableBtn_changevisible(itemIndex, true);
        } else {
            this.removableBtn_changevisible(itemIndex, false);
            this.removableBtn_formate();
            this.props.callback(
                this.props.catalog,
                this.state.optionalItemList[itemIndex].label,
                null
            );
        }
    };

    removableBtn = (key, label) => {
        return (
            <Grid sx={{ width: 1 / 3 }}>
                <FormControl variant="outlined" sx={{ width: 1 }}>
                    <InputLabel htmlFor="outlined-adornment-password">
                        {label}
                    </InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password"
                        type="text"
                        name={label}
                        onChange={this.handleOnChange}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    data-key={key}
                                    onClick={this.removableBtn_drop}
                                    edge="end"
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </InputAdornment>
                        }
                        label={label}
                    />
                </FormControl>
            </Grid>
        );
    };
    removableBtn_formate = () => {
        return this.state.optionalItemList.map((data) => {
            return (() => {
                if (data.visible == true) {
                    return this.removableBtn(data.key, data.label);
                }
            })();
        });
    };
    removableBtn_show = () => {
        if (this.state.removableBtn == null) {
            return this.removableBtn_formate();
        } else {
            return this.state.removableBtn;
        }
    };
    removableBtn_drop = (e) => {
        let itemIndex = this.findOptionalItemIndex(
            e.currentTarget.getAttribute("data-key")
        );
        this.removableBtn_changevisible(itemIndex, false);
        this.removableBtn_formate();
        this.props.callback(
            this.props.catalog,
            this.state.optionalItemList[itemIndex].label,
            null
        );
    };
    removableBtn_changevisible = (itemIndex, visible) => {
        let items = this.state.optionalItemList;
        let item = { ...items[itemIndex] };
        item.visible = visible;
        items[itemIndex] = item;
        this.setState({ anchorEl: null, open: false, optionalItemList: items });
    };

    render() {
        return (
            <Grid
                container="container"
                spacing={2}
                columns={{ xs: 4, sm: 8, md: 12 }}
            >
                {this.props.opts.map((data) => {
                    return (() => {
                        if (data.visible === true) {
                            let element;
                            let defwidth = 1 / 3;

                            if (data.type === "TextField") {
                                element = (
                                    <TextField
                                        name={data.label}
                                        label={data.label}
                                        onChange={this.handleOnChange}
                                    />
                                );
                            } else if (data.type === "SigleSelect") {
                                element = (
                                    <SigleSelect
                                        list={data.value}
                                        label={data.label}
                                        callback={this.handleOnChange}
                                    />
                                );
                            } else if (data.type === "multiline") {
                                defwidth = 1;
                                element = (
                                    <TextField
                                        name={data.label}
                                        label={data.label}
                                        onChange={this.handleOnChange}
                                        multiline
                                        rows={9}
                                    />
                                );
                            } else if (data.type === "filled") {
                                defwidth = 1;
                                element = (
                                    <TextField
                                        name={data.label}
                                        label={data.label}
                                        onChange={this.handleOnChange}
                                        id="fullWidth"
                                    />
                                );
                            } else if (data.type === "CVE") {
                                defwidth = 1;

                                if (this.state.cveOpt == false) {
                                    this.fetchCveData();
                                }
                                console.log(this.state.cveOpt);

                                element = (
                                    <Autocomplete
                                        id="country-select-demo"
                                        sx={{ width: 300 }}
                                        options={this.state.cveOpt}
                                        autoHighlight
                                        getOptionLabel={(option) =>
                                            option.CveMetadata.CveID
                                        }
                                        renderOption={(props, option) => {
                                            if (option != null) {
                                                console.log(
                                                    option.Containers.Cna
                                                );
                                                if (
                                                    option.Containers.Cna
                                                        .Descriptions == null
                                                ) {
                                                    option.Containers.Cna.Descriptions =
                                                        [];
                                                    option.Containers.Cna.Descriptions[0] =
                                                        {
                                                            Value: "no descriptions ...",
                                                        };
                                                }
                                                return (
                                                    <Box
                                                        component="div"
                                                        sx={{
                                                            display: "flex",
                                                            flexDirection:
                                                                "column",
                                                            alignContent:
                                                                "flexStart",
                                                        }}
                                                        {...props}
                                                    >
                                                        <Typography
                                                            variant="button"
                                                            display="block"
                                                            gutterBottom
                                                        >
                                                            {
                                                                option
                                                                    .CveMetadata
                                                                    .CveID
                                                            }
                                                        </Typography>
                                                        <Typography
                                                            variant="body2"
                                                            gutterBottom
                                                        >
                                                            {option.Containers
                                                                .Cna
                                                                .Descriptions[0]
                                                                .Value <= 69
                                                                ? option
                                                                      .Containers
                                                                      .Cna
                                                                      .Descriptions[0]
                                                                      .Value
                                                                : option.Containers.Cna.Descriptions[0].Value.substr(
                                                                      0,
                                                                      69
                                                                  ) + "..."}
                                                        </Typography>
                                                    </Box>
                                                );
                                            }
                                        }}
                                        onInputChange={(
                                            event,
                                            newInputValue
                                        ) => {
                                            this.searchCveData(newInputValue);
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label={data.label}
                                                inputProps={{
                                                    ...params.inputProps,
                                                    autoComplete:
                                                        "new-password", // disable autocomplete and autofill
                                                }}
                                            />
                                        )}
                                        filterOptions={(x) => x}
                                    />
                                );
                            } else if (data.type === "Tags") {
                                defwidth = 1;

                                if (!this.state.cveOpt) {
                                    this.fetchTagData();
                                }
                                console.log(this.state.cveOpt);

                                element = (
                                    <Autocomplete
                                        id="country-select-demo"
                                        sx={{ width: 300 }}
                                        options={this.state.cveOpt}
                                        autoHighlight
                                        getOptionLabel={(option) =>
                                            option.CveMetadata.CveID
                                        }
                                        renderOption={(props, option) => {
                                            if (option != null) {
                                                console.log(
                                                    option.Containers.Cna
                                                );
                                                if (
                                                    option.Containers.Cna
                                                        .Descriptions == null
                                                ) {
                                                    option.Containers.Cna.Descriptions =
                                                        [];
                                                    option.Containers.Cna.Descriptions[0] =
                                                        {
                                                            Value: "no descriptions ...",
                                                        };
                                                }
                                                return (
                                                    <Box
                                                        component="div"
                                                        sx={{
                                                            display: "flex",
                                                            flexDirection:
                                                                "column",
                                                            alignContent:
                                                                "flexStart",
                                                        }}
                                                        {...props}
                                                    >
                                                        <Typography
                                                            variant="button"
                                                            display="block"
                                                            gutterBottom
                                                        >
                                                            {
                                                                option
                                                                    .CveMetadata
                                                                    .CveID
                                                            }
                                                        </Typography>
                                                        <Typography
                                                            variant="body2"
                                                            gutterBottom
                                                        >
                                                            {option.Containers
                                                                .Cna
                                                                .Descriptions[0]
                                                                .Value <= 69
                                                                ? option
                                                                      .Containers
                                                                      .Cna
                                                                      .Descriptions[0]
                                                                      .Value
                                                                : option.Containers.Cna.Descriptions[0].Value.substr(
                                                                      0,
                                                                      69
                                                                  ) + "..."}
                                                        </Typography>
                                                    </Box>
                                                );
                                            }
                                        }}
                                        onInputChange={(
                                            event,
                                            newInputValue
                                        ) => {
                                            this.searchTagData(newInputValue);
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label={data.label}
                                                inputProps={{
                                                    ...params.inputProps,
                                                    autoComplete:
                                                        "new-password", // disable autocomplete and autofill
                                                }}
                                            />
                                        )}
                                        filterOptions={(x) => x}
                                    />
                                );
                            }

                            return (
                                <Grid
                                    data-key={data.key}
                                    sx={{ width: `${defwidth}` }}
                                >
                                    {element}
                                </Grid>
                            );
                        }
                    })();
                })}
                <this.removableBtn_show />
                <this.optsBtn />
            </Grid>
        );
    }
}
