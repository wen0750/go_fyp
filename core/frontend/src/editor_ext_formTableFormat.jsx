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
    FormControl,
} from "@mui/material";

import Grid from "@mui/material/Unstable_Grid2";
import DeleteIcon from "@mui/icons-material/Delete";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
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

        console.log(this.state.optionalItemList);

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
                <FormControl variant="outlined" sx={{ width: 1, height: 1 }}>
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
                id="basiceee-menu"
                anchorEl={this.state.anchorEl}
                open={this.state.open}
                onClose={this.optsBtnMenu_close}
                MenuListProps={{
                    "aria-labelledby": "basic-button",
                }}
            >
                {this.state.optionalItemList.map((data) => {
                    return (() => {
                        if (data.visible === false && data.removable === true) {
                            return (
                                <MenuItem
                                    data-key={data.key}
                                    onClick={this.optsBtnMenuOpt_click}
                                >
                                    {data.label}
                                </MenuItem>
                            );
                        }
                    })();
                })}
            </Menu>
        );
    };
    optsBtnMenu_open = (event) => {
        this.setState({ anchorEl: event.currentTarget, open: true });
    };
    optsBtnMenu_close = () => {
        this.setState({ anchorEl: null, open: false, optionalItemList: items });
    };
    optsBtnMenuOpt_click = (e) => {
        let itemIndex = this.findOptionalItemIndex(
            e.currentTarget.getAttribute("data-key")
        );
        this.removableBtn_changeVisable(itemIndex, true);

        console.log(this.state.optionalItemList);
    };

    removableBtn = (key, lable) => {
        return (
            <Grid sx={{ width: 1 / 3 }}>
                <FormControl variant="outlined" sx={{ width: 1 }}>
                    <InputLabel htmlFor="outlined-adornment-password">
                        {lable}
                    </InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password"
                        type="text"
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
                        label="Password"
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
        this.removableBtn_changeVisable(itemIndex, false);
        this.removableBtn_formate();
    };
    removableBtn_changeVisable = (itemIndex, visable) => {
        let items = this.state.optionalItemList;
        let item = { ...items[itemIndex] };
        item.visible = visable;
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
                                element = <TextField label={data.label} />;
                            } else if (data.type === "SigleSelect") {
                                element = (
                                    <SigleSelect
                                        list={data.value}
                                        label={data.label}
                                    />
                                );
                            } else if (data.type === "multiline") {
                                defwidth = 1;
                                element = (
                                    <TextField
                                        label={data.label}
                                        multiline
                                        rows={3}
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
