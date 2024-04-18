import * as React from "react";
import { StyledEngineProvider, CssVarsProvider } from "@mui/joy/styles";

import Grid from "@mui/joy/Grid";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Divider from "@mui/joy/Divider";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Link from "@mui/joy/Link";
import Typography from "@mui/joy/Typography";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

import PropTypes from "prop-types";
import TextField from "@mui/material/TextField";
import AutocompleteX, { autocompleteClasses } from "@mui/material/Autocomplete";
import useMediaQuery from "@mui/material/useMediaQuery";
import ListSubheader from "@mui/material/ListSubheader";
import Popper from "@mui/material/Popper";
import { useTheme, styled } from "@mui/material/styles";
import { VariableSizeList } from "react-window";
import TypographyX from "@mui/material/Typography";

// input option
import Radio from "@mui/joy/Radio";
import RadioGroup from "@mui/joy/RadioGroup";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Textarea from "@mui/joy/Textarea";
import Autocomplete from "@mui/joy/Autocomplete";
import AutocompleteOption from "@mui/joy/AutocompleteOption";
import Switch from "@mui/joy/Switch";

// drop down menu
import MenuButton from "@mui/joy/MenuButton";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import ListItemContent from "@mui/joy/ListItemContent";
import Menu from "@mui/joy/Menu";
import MenuItem from "@mui/joy/MenuItem";
import Dropdown from "@mui/joy/Dropdown";

// layout
import Box from "@mui/joy/Box";
import Tooltip from "@mui/joy/Tooltip";

// icon
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import LinkIcon from "@mui/icons-material/Link";

function firstCharToUpper(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatDescription(props) {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                p: 1,
            }}
        >
            <Typography color="#FFFFFF" sx={{ width: "auto", maxWidth: 360 }}>
                {props.description}
            </Typography>
            {props.link && (
                <Link
                    level="h1"
                    variant="outlined"
                    aria-labelledby="heading-demo"
                    href={props.link}
                    fontSize="lg"
                    borderRadius="sm"
                    sx={{ color: "#00ADB5", width: 140, justifyContent: "center", mt: 3 }}
                >
                    Reference
                    <LinkIcon sx={{ fontSize: 40, ml: 1 }} />
                </Link>
            )}
        </Box>
    );
}

const LISTBOX_PADDING = 8;
function renderRow(props) {
    const { data, index, style } = props;
    const dataSet = data[index];
    const inlineStyle = {
        ...style,
        top: style.top + LISTBOX_PADDING,
    };

    if (dataSet.hasOwnProperty("group")) {
        return (
            <ListSubheader key={dataSet.key} component="div" style={inlineStyle}>
                {dataSet.group}
            </ListSubheader>
        );
    }

    console.log(dataSet);

    return (
        <Typography component="li" {...dataSet[0]} noWrap style={inlineStyle}>
            {dataSet[1].name}
        </Typography>
    );
}
const OuterElementContext = React.createContext({});
const OuterElementType = React.forwardRef((props, ref) => {
    const outerProps = React.useContext(OuterElementContext);
    return <div ref={ref} {...props} {...outerProps} />;
});
function useResetCache(data) {
    const ref = React.useRef(null);
    React.useEffect(() => {
        if (ref.current != null) {
            ref.current.resetAfterIndex(0, true);
        }
    }, [data]);
    return ref;
}
// Adapter for react-window
const ListboxComponent = React.forwardRef(function ListboxComponent(props, ref) {
    const { children, ...other } = props;
    const itemData = [];
    children.forEach((item) => {
        itemData.push(item);
        itemData.push(...(item.children || []));
    });

    const theme = useTheme();
    const smUp = useMediaQuery(theme.breakpoints.up("sm"), {
        noSsr: true,
    });
    const itemCount = itemData.length;
    const itemSize = smUp ? 36 : 48;

    const getChildSize = (child) => {
        if (child.hasOwnProperty("group")) {
            return 48;
        }

        return itemSize;
    };

    const getHeight = () => {
        if (itemCount > 8) {
            return 8 * itemSize;
        }
        return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
    };

    const gridRef = useResetCache(itemCount);

    return (
        <div ref={ref}>
            <OuterElementContext.Provider value={other}>
                <VariableSizeList
                    itemData={itemData}
                    height={getHeight() + 2 * LISTBOX_PADDING}
                    width="100%"
                    ref={gridRef}
                    outerElementType={OuterElementType}
                    innerElementType="ul"
                    itemSize={(index) => getChildSize(itemData[index])}
                    overscanCount={5}
                    itemCount={itemCount}
                >
                    {renderRow}
                </VariableSizeList>
            </OuterElementContext.Provider>
        </div>
    );
});

ListboxComponent.propTypes = {
    children: PropTypes.node,
};

const StyledPopper = styled(Popper)({
    [`& .${autocompleteClasses.listbox}`]: {
        boxSizing: "border-box",
        "& ul": {
            padding: 0,
            margin: 0,
        },
    },
});

// options components
export function CustomAutocomplete(props) {
    return (
        <FormControl sx={{ gridColumn: "1/-1" }}>
            <FormLabel>
                {props.label}
                <Tooltip title={formatDescription(props)} placement="right" sx={{ maxWidth: 360, zIndex: 20, ml: 1 }}>
                    <HelpOutlineIcon color="action" />
                </Tooltip>
            </FormLabel>
            <Autocomplete
                placeholder="Decorators"
                options={props.options}
                onChange={(event, newValue) => {
                    props.onChange(props.label, newValue);
                }}
                size="lg"
            />
        </FormControl>
    );
}
export function CustomAutocompleteMC(props) {
    return (
        <FormControl sx={{ gridColumn: "1/-1", zIndex: 300 }}>
            <FormLabel>
                {firstCharToUpper(props.label)}
                <Tooltip title={formatDescription(props)} placement="right" sx={{ maxWidth: 360, zIndex: 20, ml: 1 }}>
                    <HelpOutlineIcon color="action" />
                </Tooltip>
            </FormLabel>
            <AutocompleteX
                multiple
                id={props.label}
                disableListWrap
                PopperComponent={StyledPopper}
                ListboxComponent={ListboxComponent}
                options={props.options}
                getOptionLabel={(option) => option.name}
                onChange={(event, newValue) => {
                    props.onChange(props.label, newValue);
                }}
                renderInput={(params) => <TextField {...params} label="" />}
                renderOption={(props, option, state) => [props, option, state.index]}
            />
            {/* <Autocomplete
                multiple
                id={props.label}
                placeholder={props.label}
                options={props.options}
                getOptionLabel={(option) => option.name}
                onChange={(event, newValue) => {
                    props.onChange(props.label, newValue);
                }}
                size="lg"
            /> */}
        </FormControl>
    );
}
export function CustomAutocompleteFreeMC(props) {
    return (
        <FormControl sx={{ gridColumn: "1/-1" }}>
            <FormLabel>
                {firstCharToUpper(props.label)}
                <Tooltip title={formatDescription(props)} placement="right" sx={{ maxWidth: 360, zIndex: 20, ml: 1 }}>
                    <HelpOutlineIcon color="action" />
                </Tooltip>
            </FormLabel>
            <Autocomplete
                multiple
                freeSolo
                id={props.label}
                placeholder={props.label}
                options={["Last input 1", "Last input 2", "Last input 3", "Last input 4", "Last input 5"]}
                // getOptionLabel={(option) => option.label}
                onChange={(event, newValue) => {
                    props.onChange(props.ikey, props.label, newValue);
                }}
                size="lg"
            />
        </FormControl>
    );
}
export function CustomAutocompleteFree(props) {
    return (
        <FormControl sx={{ gridColumn: "1/-1" }}>
            <FormLabel>
                {firstCharToUpper(props.label)}
                <Tooltip title={formatDescription(props)} placement="right" sx={{ maxWidth: 360, zIndex: 20, ml: 1 }}>
                    <HelpOutlineIcon color="action" />
                </Tooltip>
            </FormLabel>
            <Autocomplete
                freeSolo
                id={props.label}
                placeholder={props.label}
                options={props.options}
                // getOptionLabel={(option) => option.label}
                onChange={(event, newValue) => {
                    props.onChange(props.ikey, props.label, newValue);
                }}
                size="lg"
            />
        </FormControl>
    );
}
export function PartAutocompleteMC(props) {
    return (
        <FormControl sx={{ gridColumn: "1/-1" }}>
            <FormLabel>
                {firstCharToUpper(props.label)}
                <Tooltip title={formatDescription(props)} placement="right" sx={{ maxWidth: 360, zIndex: 20, ml: 1 }}>
                    <HelpOutlineIcon color="action" />
                </Tooltip>
            </FormLabel>
            <Autocomplete
                multiple
                disableClearable
                id={props.label}
                placeholder={props.label}
                options={props.options}
                getOptionLabel={(option) => option.label}
                renderOption={(props, option) => (
                    <AutocompleteOption {...props}>
                        <ListItemContent sx={{ fontSize: "sm" }}>
                            {option.label}
                            <Typography level="body-xs">{option.description}</Typography>
                        </ListItemContent>
                    </AutocompleteOption>
                )}
                onChange={(event, newValue) => {
                    var tmpstr = "";
                    newValue.forEach((val) => {
                        tmpstr = tmpstr + val.label + ",";
                    });
                    tmpstr = tmpstr.substring(0, tmpstr.length - 1);
                    props.onChange(props.ikey, props.label, tmpstr);
                }}
                size="lg"
            />
        </FormControl>
    );
}
export function ExtractorAutocomplete(props) {
    return (
        <FormControl sx={{ gridColumn: "1/-1" }}>
            <FormLabel>
                {firstCharToUpper(props.label)}
                <Tooltip title={formatDescription(props)} placement="right" sx={{ maxWidth: 360, zIndex: 20, ml: 1 }}>
                    <HelpOutlineIcon color="action" />
                </Tooltip>
            </FormLabel>
            <Autocomplete
                freeSolo
                disableClearable
                id={props.label}
                placeholder={props.label}
                options={props.options}
                getOptionLabel={(option) => option.label}
                renderOption={(props, option) => (
                    <AutocompleteOption {...props}>
                        <ListItemContent sx={{ fontSize: "sm" }}>
                            {option.label}
                            <Typography level="body-xs">{option.description}</Typography>
                        </ListItemContent>
                    </AutocompleteOption>
                )}
                onChange={(event, newValue) => {
                    var tmpstr = "";
                    newValue.forEach((val) => {
                        tmpstr = tmpstr + val.label + ",";
                    });
                    tmpstr = tmpstr.substring(0, tmpstr.length - 1);
                    props.onChange(props.ikey, props.label, tmpstr);
                }}
                size="lg"
            />
        </FormControl>
    );
}
export function CustomSelectionBox(props) {
    return (
        <FormControl sx={{ gridColumn: "1/-1" }}>
            <FormLabel>
                {firstCharToUpper(props.label)}{" "}
                <Tooltip placement="right" sx={{ maxWidth: 360, zIndex: 20, ml: 1 }} title={formatDescription(props)}>
                    <HelpOutlineIcon color="action" />
                </Tooltip>
            </FormLabel>
            <Select
                size="lg"
                key={props.label}
                onChange={(event, newValue) => {
                    props.onChange(props.label, newValue);
                }}
            >
                {props.options &&
                    props.options.map((data, i) => {
                        return (
                            <Option value={data} key={props.label + i}>
                                {data}
                            </Option>
                        );
                    })}
            </Select>
        </FormControl>
    );
}

export function CustomRadioButtonsForAttack(props) {
    return (
        <RadioGroup
            orientation="horizontal"
            aria-labelledby="segmented-controls-example"
            name="justify"
            value={props.value}
            onChange={(event) => props.onChange(event.target.value)}
            sx={{
                minHeight: 48,
                padding: "4px",
                borderRadius: "12px",
                bgcolor: "var(--joy-palette-neutral-400, #9FA6AD)",
                "--RadioGroup-gap": "4px",
                "--Radio-actionRadius": "8px",
            }}
        >
            {["batteringram", "pitchfork", "clusterbomb"].map((item) => (
                <Radio
                    key={item}
                    color="neutral"
                    value={item}
                    disableIcon
                    label={item.toUpperCase()}
                    variant="plain"
                    disabled={item == "batteringram" && props.options.length > 1}
                    sx={{
                        px: 2,
                        alignItems: "center",
                        ...(item === "batteringram" && props.options.length > 1
                            ? {
                                  bgcolor: "grey",
                                  opacity: 0.5,
                                  borderRadius: "8px",
                              }
                            : {}),
                    }}
                    slotProps={{
                        action: ({ checked }) => ({
                            sx: {
                                ...(checked && {
                                    bgcolor: "background.surface",
                                    boxShadow: "sm",
                                    "&:hover": {
                                        bgcolor: "background.surface",
                                    },
                                }),
                            },
                        }),
                    }}
                />
            ))}
        </RadioGroup>
    );
}

export function ConditionRadioButtons(props) {
    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, my: 1 }}>
            <Typography id="segmented-controls-example" fontWeight="lg" fontSize="sm">
                <FormLabel>
                    Condition
                    <Tooltip title={formatDescription(props)} placement="right" sx={{ zIndex: 20, ml: 1 }}>
                        <HelpOutlineIcon color="action" />
                    </Tooltip>
                </FormLabel>
            </Typography>
            <RadioGroup
                orientation="horizontal"
                aria-labelledby="segmented-controls-example"
                name="justify"
                value={props.value}
                onChange={(event) => props.onChange(props.ikey, "condition", event.target.value)}
                sx={{
                    minHeight: 48,
                    padding: "4px",
                    borderRadius: "12px",
                    bgcolor: "var(--joy-palette-neutral-400, #9FA6AD)",
                    "--RadioGroup-gap": "4px",
                    "--Radio-actionRadius": "8px",
                }}
            >
                {["or", "and"].map((item) => (
                    <Radio
                        key={item}
                        color="neutral"
                        value={item}
                        disableIcon
                        label={item.toUpperCase()}
                        variant="plain"
                        disabled={item == "and" && props.options.length === 1 && props.options[0] === "or"}
                        sx={{
                            px: 2,
                            alignItems: "center",
                            ...(item === "and" && props.options.length === 1 && props.options[0] === "or"
                                ? {
                                      bgcolor: "grey",
                                      opacity: 0.5,
                                      borderRadius: "8px",
                                  }
                                : {}),
                        }}
                        slotProps={{
                            action: ({ checked }) => ({
                                sx: {
                                    ...(checked && {
                                        bgcolor: "background.surface",
                                        boxShadow: "sm",
                                        "&:hover": {
                                            bgcolor: "background.surface",
                                        },
                                    }),
                                },
                            }),
                        }}
                    />
                ))}
            </RadioGroup>
        </Box>
    );
}

export function CustomSwitchButtons(props) {
    return (
        <FormControl orientation="horizontal" sx={{ width: 1, justifyContent: "space-between" }}>
            <div>
                <FormLabel>
                    {props.label}
                    <Tooltip
                        placement="right"
                        sx={{ maxWidth: 360, zIndex: 20, ml: 1 }}
                        title={formatDescription(props)}
                    >
                        <HelpOutlineIcon color="action" />
                    </Tooltip>
                </FormLabel>
            </div>
            <Switch
                checked={props.value}
                onChange={(event) => props.onChange(props.ikey, props.local, event.target.checked)}
                color={props.value ? "success" : "neutral"}
                variant={props.value ? "solid" : "outlined"}
                endDecorator={props.value ? "On" : "Off"}
                slotProps={{
                    endDecorator: {
                        sx: {
                            minWidth: 24,
                        },
                    },
                }}
            />
        </FormControl>
    );
}
export function CustomTextInputBox(props) {
    return (
        <FormControl sx={{ gridColumn: "1/-1" }}>
            <FormLabel>
                {firstCharToUpper(props.label)}{" "}
                <Tooltip placement="right" sx={{ maxWidth: 360, zIndex: 20, ml: 1 }} title={formatDescription(props)}>
                    <HelpOutlineIcon color="action" />
                </Tooltip>
            </FormLabel>
            <Input
                size="lg"
                onChange={(event) => {
                    props.onChange(props.label, event.target.value);
                }}
            />
        </FormControl>
    );
}
export function CustomTextareaInputBox(props) {
    return (
        <FormControl sx={{ gridColumn: "1/-1" }}>
            <FormLabel>
                {firstCharToUpper(props.label)}
                <Tooltip title={formatDescription(props)} placement="right" sx={{ maxWidth: 360, zIndex: 20, ml: 1 }}>
                    <HelpOutlineIcon color="action" />
                </Tooltip>
            </FormLabel>

            <Textarea
                minRows={1}
                size="lg"
                onChange={(event) => {
                    props.onChange(props.label, event.target.value);
                }}
                defaultValue={props.value}
            />
        </FormControl>
    );
}

export function ControlledDropdown(props) {
    return (
        <Dropdown>
            <MenuButton startDecorator={<AddIcon />}>More Options</MenuButton>
            <Menu sx={{ minWidth: 180, "--ListItemDecorator-size": "24px" }}>
                <List sx={{ width: 1 }} key={props.ukey + "_optionlist"}>
                    {props.options.map((item, ix) => (
                        <MenuItem
                            key={item.label + ix}
                            role="menuitemradio"
                            aria-checked={item.enabled}
                            onClick={() => {
                                props.onChange(ix);
                            }}
                            sx={{ p: 0, m: 0 }}
                        >
                            <ListItem sx={{ m: 0 }}>
                                <ListItemDecorator>{item.enabled === true && <CheckIcon />}</ListItemDecorator>
                                {item.label}
                            </ListItem>
                        </MenuItem>
                    ))}
                </List>
            </Menu>
        </Dropdown>
    );
}
export function GroupControlledDropdown(props) {
    return (
        <Dropdown>
            <MenuButton startDecorator={<AddIcon />}>More Options</MenuButton>
            <Menu sx={{ minWidth: 180, "--ListItemDecorator-size": "24px" }}>
                {Object.entries(props.options).map(([name, animals], index) => (
                    <>
                        <List sx={{ width: 1 }} key={props.ukey + "_optionlist"}>
                            <ListItem id={`select-group-${name}`} sx={{ my: 0 }} sticky>
                                <Typography level="body-xs" textTransform="uppercase">
                                    {name} ({animals.length})
                                </Typography>
                            </ListItem>

                            {animals.map((anim, ix) => (
                                <MenuItem
                                    key={"sss" + ix}
                                    role="menuitemradio"
                                    aria-checked={anim.enabled}
                                    onClick={() => {
                                        if (index == 0) {
                                            if (ix == 0) {
                                                props.onXChange("array");
                                            } else {
                                                props.onXChange("object");
                                            }
                                        } else {
                                            props.onChange(ix);
                                        }
                                    }}
                                    sx={{ p: 0, m: 0 }}
                                >
                                    <ListItem sx={{ m: 0 }}>
                                        <ListItemDecorator>{anim.enabled === true && <CheckIcon />}</ListItemDecorator>
                                        {anim.label}
                                    </ListItem>
                                </MenuItem>
                            ))}
                        </List>
                    </>
                ))}
            </Menu>
        </Dropdown>
    );
}

// Card components
export function CustomCard(props) {
    return (
        <Card
            variant="outlined"
            sx={{
                maxHeight: "max-content",
                maxWidth: "100%",
                mx: "auto",
                // to make the demo resizable
                overflow: "auto",
                resize: "horizontal",
                marginBottom: 2,
            }}
        >
            <Typography
                level="title-lg"
                endDecorator={
                    <Tooltip title={formatDescription(props)} sx={{ maxWidth: 360 }} placement="right">
                        <HelpOutlineIcon color="action" />
                    </Tooltip>
                }
            >
                {props.title}
            </Typography>
            <Divider inset="none" />
            <CardContent>
                <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} sx={{ flexGrow: 1 }}>
                    {props.children}
                </Grid>
            </CardContent>
        </Card>
    );
}
