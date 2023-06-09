import React, { Component, useState } from "react";

import { useTheme, createTheme, ThemeProvider } from "@mui/material/styles";
import {
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
} from "@mui/material";

import Grid from "@mui/material/Unstable_Grid2";
import DeleteIcon from "@mui/icons-material/Delete";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import Check from "@mui/icons-material/Check";
import SigleSelect from "./editor_ext_selector";

export default class FormTableFormat extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            anchorEl: null,
            open: false,
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
