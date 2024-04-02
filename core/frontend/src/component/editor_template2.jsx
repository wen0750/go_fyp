import * as React from "react";

import { experimentalStyled as styled } from "@mui/material/styles";

import { Container } from "@mui/material";

import "../assets/css/editor.css";
import { CodeBlock, dracula } from "react-code-blocks";

import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

import Card from "@mui/joy/Card";
import CardActions from "@mui/joy/CardActions";
import CardContent from "@mui/joy/CardContent";
import Divider from "@mui/joy/Divider";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Typography from "@mui/joy/Typography";

import Grid from "@mui/joy/Grid";

// layout
import Box from "@mui/joy/Box";
import Tooltip from "@mui/joy/Tooltip";
import Button from "@mui/joy/Button";
import IconButton from "@mui/joy/IconButton";

// input option
import Radio from "@mui/joy/Radio";
import RadioGroup from "@mui/joy/RadioGroup";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Textarea from "@mui/joy/Textarea";
import Checkbox from "@mui/joy/Checkbox";
import Autocomplete from "@mui/joy/Autocomplete";
import AutocompleteOption from "@mui/joy/AutocompleteOption";
import Switch from "@mui/joy/Switch";

// drop down menu
import MenuButton from "@mui/joy/MenuButton";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import ListItemContent from "@mui/joy/ListItemContent";
import ListDivider from "@mui/joy/ListDivider";
import Menu from "@mui/joy/Menu";
import MenuItem from "@mui/joy/MenuItem";
import ArrowRight from "@mui/icons-material/ArrowRight";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import Dropdown from "@mui/joy/Dropdown";

// Table
import Table from "@mui/joy/Table";

// icon
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import { common } from "@mui/material/colors";

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

// options components
function CustomAutocomplete(props) {
    return (
        <FormControl sx={{ gridColumn: "1/-1" }}>
            <FormLabel>
                {props.label}
                <Tooltip title={props.description} placement="right" sx={{ zIndex: 20, ml: 1 }}>
                    <HelpOutlineIcon color="action" />
                </Tooltip>
            </FormLabel>
            <Autocomplete
                placeholder="Decorators"
                options={top100Films}
                onChange={(event, newValue) => {
                    props.onChange(props.label, newValue);
                }}
                size="lg"
            />
        </FormControl>
    );
}
function CustomAutocompleteMC(props) {
    return (
        <FormControl sx={{ gridColumn: "1/-1" }}>
            <FormLabel>
                {firstCharToUpper(props.label)}
                <Tooltip title={props.description} placement="right" sx={{ zIndex: 20, ml: 1 }}>
                    <HelpOutlineIcon color="action" />
                </Tooltip>
            </FormLabel>
            <Autocomplete
                multiple
                id={props.label}
                placeholder={props.label}
                options={top100Films}
                getOptionLabel={(option) => option.label}
                onChange={(event, newValue) => {
                    props.onChange(props.label, newValue);
                }}
                size="lg"
            />
        </FormControl>
    );
}
function CustomAutocompleteFreeMC(props) {
    return (
        <FormControl sx={{ gridColumn: "1/-1" }}>
            <FormLabel>
                {firstCharToUpper(props.label)}
                <Tooltip title={props.description} placement="right" sx={{ zIndex: 20, ml: 1 }}>
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
function CustomAutocompleteFree(props) {
    return (
        <FormControl sx={{ gridColumn: "1/-1" }}>
            <FormLabel>
                {firstCharToUpper(props.label)}
                <Tooltip title={props.description} placement="right" sx={{ zIndex: 20, ml: 1 }}>
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
function PartAutocompleteMC(props) {
    return (
        <FormControl sx={{ gridColumn: "1/-1" }}>
            <FormLabel>
                {firstCharToUpper(props.label)}
                <Tooltip title={props.description} placement="right" sx={{ zIndex: 20, ml: 1 }}>
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
function ExtractorAutocomplete(props) {
    return (
        <FormControl sx={{ gridColumn: "1/-1" }}>
            <FormLabel>
                {firstCharToUpper(props.label)}
                <Tooltip title={props.description} placement="right" sx={{ zIndex: 20, ml: 1 }}>
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
function CustomSelectionBox(props) {
    return (
        <FormControl sx={{ gridColumn: "1/-1" }}>
            <FormLabel>
                {firstCharToUpper(props.label)}{" "}
                <Tooltip title={props.description} placement="right" sx={{ zIndex: 20, ml: 1 }}>
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
function CustomRadioButtons() {
    const [justify, setJustify] = React.useState("flex-start");
    return (
        <FormControl sx={{ gridColumn: "1/-1" }}>
            <FormLabel>
                {props.label}
                <Tooltip title={props.description} placement="right" sx={{ zIndex: 20, ml: 1 }}>
                    <HelpOutlineIcon color="action" />
                </Tooltip>
            </FormLabel>

            <RadioGroup
                orientation="horizontal"
                aria-labelledby="segmented-controls-example"
                name="justify"
                value={justify}
                onChange={(event) => setJustify(event.target.value)}
                sx={{
                    minHeight: 48,
                    padding: "4px",
                    borderRadius: "12px",
                    bgcolor: "neutral.softBg",
                    "--RadioGroup-gap": "4px",
                    "--Radio-actionRadius": "8px",
                }}
            >
                {["flex-start", "center", "flex-end"].map((item) => (
                    <Radio
                        key={item}
                        color="neutral"
                        value={item}
                        disableIcon
                        label={item}
                        variant="plain"
                        sx={{
                            px: 2,
                            alignItems: "center",
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
        </FormControl>
    );
}

function ConditionRadioButtons(props) {
    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, my: 1 }}>
            <Typography id="segmented-controls-example" fontWeight="lg" fontSize="sm">
                <FormLabel>
                    Condition
                    <Tooltip title={"Condition xxxxxxx"} placement="right" sx={{ zIndex: 20, ml: 1 }}>
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

function CustomSwitchButtons(props) {
    return (
        <FormControl orientation="horizontal" sx={{ width: 1, justifyContent: "space-between" }}>
            <div>
                <FormLabel>
                    {props.label}
                    <Tooltip title={props.description} placement="right" sx={{ zIndex: 20, ml: 1 }}>
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
function CustomTextInputBox(props) {
    return (
        <FormControl sx={{ gridColumn: "1/-1" }}>
            <FormLabel>
                {firstCharToUpper(props.label)}{" "}
                <Tooltip title={props.description} placement="right" sx={{ zIndex: 20, ml: 1 }}>
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
function CustomTextareaInputBox(props) {
    return (
        <FormControl sx={{ gridColumn: "1/-1" }}>
            <FormLabel>
                {firstCharToUpper(props.label)}
                <Tooltip title={props.description} placement="right" sx={{ zIndex: 20, ml: 1 }}>
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

function ControlledDropdown(props) {
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
function GroupControlledDropdown(props) {
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
function CustomCard(props) {
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
                    <Tooltip title={props.description} placement="right">
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

const top100Films = [
    { label: "The Shawshank Redemption", year: 1994 },
    { label: "The Godfather", year: 1972 },
    { label: "The Godfather: Part II", year: 1974 },
    { label: "The Dark Knight", year: 2008 },
    { label: "12 Angry Men", year: 1957 },
    { label: "Schindler's List", year: 1993 },
    { label: "Pulp Fiction", year: 1994 },
    {
        label: "The Lord of the Rings: The Return of the King",
        year: 2003,
    },
    { label: "The Good, the Bad and the Ugly", year: 1966 },
    { label: "Fight Club", year: 1999 },
    {
        label: "The Lord of the Rings: The Fellowship of the Ring",
        year: 2001,
    },
    {
        label: "Star Wars: Episode V - The Empire Strikes Back",
        year: 1980,
    },
    { label: "Forrest Gump", year: 1994 },
    { label: "Inception", year: 2010 },
    {
        label: "The Lord of the Rings: The Two Towers",
        year: 2002,
    },
    { label: "One Flew Over the Cuckoo's Nest", year: 1975 },
    { label: "Goodfellas", year: 1990 },
    { label: "The Matrix", year: 1999 },
    { label: "Seven Samurai", year: 1954 },
    {
        label: "Star Wars: Episode IV - A New Hope",
        year: 1977,
    },
    { label: "City of God", year: 2002 },
    { label: "Se7en", year: 1995 },
    { label: "The Silence of the Lambs", year: 1991 },
    { label: "It's a Wonderful Life", year: 1946 },
    { label: "Life Is Beautiful", year: 1997 },
    { label: "The Usual Suspects", year: 1995 },
    { label: "Léon: The Professional", year: 1994 },
    { label: "Spirited Away", year: 2001 },
    { label: "Saving Private Ryan", year: 1998 },
    { label: "Once Upon a Time in the West", year: 1968 },
    { label: "American History X", year: 1998 },
    { label: "Interstellar", year: 2014 },
    { label: "Casablanca", year: 1942 },
    { label: "City Lights", year: 1931 },
    { label: "Psycho", year: 1960 },
    { label: "The Green Mile", year: 1999 },
    { label: "The Intouchables", year: 2011 },
    { label: "Modern Times", year: 1936 },
    { label: "Raiders of the Lost Ark", year: 1981 },
    { label: "Rear Window", year: 1954 },
    { label: "The Pianist", year: 2002 },
    { label: "The Departed", year: 2006 },
    { label: "Terminator 2: Judgment Day", year: 1991 },
    { label: "Back to the Future", year: 1985 },
    { label: "Whiplash", year: 2014 },
    { label: "Gladiator", year: 2000 },
    { label: "Memento", year: 2000 },
    { label: "The Prestige", year: 2006 },
    { label: "The Lion King", year: 1994 },
    { label: "Apocalypse Now", year: 1979 },
    { label: "Alien", year: 1979 },
    { label: "Sunset Boulevard", year: 1950 },
    {
        label: "Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb",
        year: 1964,
    },
    { label: "The Great Dictator", year: 1940 },
    { label: "Cinema Paradiso", year: 1988 },
    { label: "The Lives of Others", year: 2006 },
    { label: "Grave of the Fireflies", year: 1988 },
    { label: "Paths of Glory", year: 1957 },
    { label: "Django Unchained", year: 2012 },
    { label: "The Shining", year: 1980 },
    { label: "WALL·E", year: 2008 },
    { label: "American Beauty", year: 1999 },
    { label: "The Dark Knight Rises", year: 2012 },
    { label: "Princess Mononoke", year: 1997 },
    { label: "Aliens", year: 1986 },
    { label: "Oldboy", year: 2003 },
    { label: "Once Upon a Time in America", year: 1984 },
    { label: "Witness for the Prosecution", year: 1957 },
    { label: "Das Boot", year: 1981 },
    { label: "Citizen Kane", year: 1941 },
    { label: "North by Northwest", year: 1959 },
    { label: "Vertigo", year: 1958 },
    {
        label: "Star Wars: Episode VI - Return of the Jedi",
        year: 1983,
    },
    { label: "Reservoir Dogs", year: 1992 },
    { label: "Braveheart", year: 1995 },
    { label: "M", year: 1931 },
    { label: "Requiem for a Dream", year: 2000 },
    { label: "Amélie", year: 2001 },
    { label: "A Clockwork Orange", year: 1971 },
    { label: "Like Stars on Earth", year: 2007 },
    { label: "Taxi Driver", year: 1976 },
    { label: "Lawrence of Arabia", year: 1962 },
    { label: "Double Indemnity", year: 1944 },
    {
        label: "Eternal Sunshine of the Spotless Mind",
        year: 2004,
    },
    { label: "Amadeus", year: 1984 },
    { label: "To Kill a Mockingbird", year: 1962 },
    { label: "Toy Story 3", year: 2010 },
    { label: "Logan", year: 2017 },
    { label: "Full Metal Jacket", year: 1987 },
    { label: "Dangal", year: 2016 },
    { label: "The Sting", year: 1973 },
    { label: "2001: A Space Odyssey", year: 1968 },
    { label: "Singin' in the Rain", year: 1952 },
    { label: "Toy Story", year: 1995 },
    { label: "Bicycle Thieves", year: 1948 },
    { label: "The Kid", year: 1921 },
    { label: "Inglourious Basterds", year: 2009 },
    { label: "Snatch", year: 2000 },
    { label: "3 Idiots", year: 2009 },
    { label: "Monty Python and the Holy Grail", year: 1975 },
];

export default class EditorTemplate extends React.Component {
    constructor(props) {
        super(props);

        this.matchersPartOpts = [
            { label: "template-id", description: "ID of the template executed" },
            { label: "template-info", description: "Info Block of the template executed" },
            { label: "template-path", description: "Path of the template executed" },
            { label: "host", description: "Host is the input to the template" },
            { label: "matched", description: "Matched is the input which was matched upon" },
            { label: "type", description: "Type is the type of request made" },
            { label: "request", description: "HTTP request made from the client" },
            { label: "response", description: "HTTP response received from server" },
            { label: "status_code", description: "Status Code received from the Server" },
            { label: "body", description: "HTTP response body received from server (default)" },
            { label: "content_length", description: "HTTP Response content length" },
            { label: "header", description: "HTTP response headers" },
            { label: "all_headers", description: "HTTP response headers" },
            { label: "duration", description: "HTTP request time duration" },
            { label: "all", description: "HTTP response body + headers" },
            { label: "cookies_from_response", description: "HTTP response cookies in name:value format" },
            { label: "headers_from_response", description: "HTTP response headers in name:value format" },
        ];

        this.state = {
            userinput: {},
            httpRequestOptionCounter: 0,
            matchersConditionCounter: 0,
            matchersCondition: "or",
            info_optional_list: [
                {
                    label: "impact",
                    description: "impact s",
                    component: CustomTextareaInputBox,
                    enabled: false,
                },
                {
                    label: "remediation",
                    description: "impact s",
                    component: CustomTextareaInputBox,
                    enabled: false,
                },
                {
                    label: "reference",
                    description: "impact s",
                    component: CustomTextInputBox,
                    enabled: false,
                },
            ],
            classification_optional_list: [
                {
                    label: "cvss-metrics",
                    description: "impact s",
                    component: CustomTextInputBox,
                    enabled: false,
                },
                {
                    label: "cvss-score",
                    description: "impact s",
                    component: CustomTextInputBox,
                    enabled: false,
                },
                {
                    label: "cpe",
                    description: "impact s",
                    component: CustomTextInputBox,
                    enabled: false,
                },
                {
                    label: "epss-score",
                    description: "impact s",
                    component: CustomTextInputBox,
                    enabled: false,
                },
                {
                    label: "epss-percentile",
                    description: "impact s",
                    component: CustomTextInputBox,
                    enabled: false,
                },
            ],
            http_request_optional_list: {
                custom: [
                    {
                        label: "add Value",
                        description:
                            "The Accept header defines the media types that the client is able to accept from the server. For instance, Accept: application/json, text/html indicates that the client prefers JSON or HTML responses. This information allows the server to send a resource representation that meets the client’s needs.",
                        component: Input,
                        enabled: false,
                    },
                    {
                        label: "add Field & Value",
                        description:
                            "The Accept header defines the media types that the client is able to accept from the server. For instance, Accept: application/json, text/html indicates that the client prefers JSON or HTML responses. This information allows the server to send a resource representation that meets the client’s needs.",
                        component: Input,
                        enabled: false,
                    },
                ],
                common: [
                    {
                        label: "Accept",
                        description: "s",
                        component: Input,
                        enabled: false,
                        value: "",
                        issuer: "builtin",
                    },
                    {
                        label: "Accept-Charset",
                        description: "",
                        component: Input,
                        enabled: false,
                        value: "",
                        issuer: "builtin",
                    },
                    {
                        label: "Accept-Datetime",
                        description: "",
                        component: Input,
                        enabled: false,
                        value: "",
                        issuer: "builtin",
                    },
                    {
                        label: "Accept-Encoding",
                        description: "",
                        component: Input,
                        enabled: false,
                        value: "",
                        issuer: "builtin",
                    },
                    {
                        label: "Accept-Language",
                        description: "",
                        component: Input,
                        enabled: false,
                        value: "",
                        issuer: "builtin",
                    },
                    {
                        label: "Authorization",
                        description: "",
                        component: Input,
                        enabled: false,
                        value: "",
                        issuer: "builtin",
                    },
                    {
                        label: "Cache-Control",
                        description: "",
                        component: Input,
                        enabled: false,
                        value: "",
                        issuer: "builtin",
                    },
                    {
                        label: "Connection",
                        description: "",
                        component: Input,
                        enabled: false,
                        value: "",
                        issuer: "builtin",
                    },
                    {
                        label: "Content-Length",
                        description: "",
                        component: Input,
                        enabled: false,
                        value: "",
                        issuer: "builtin",
                    },
                    {
                        label: "Content-MD5",
                        description: "",
                        component: Input,
                        enabled: false,
                        value: "",
                        issuer: "builtin",
                    },
                    {
                        label: "Content-Type",
                        description: "",
                        component: Input,
                        enabled: false,
                        value: "",
                        issuer: "builtin",
                    },
                    {
                        label: "Cookie",
                        description: "",
                        component: Input,
                        enabled: false,
                        value: "",
                        issuer: "builtin",
                    },
                    {
                        label: "Date",
                        description: "",
                        component: Input,
                        enabled: false,
                        value: "",
                        issuer: "builtin",
                    },
                    {
                        label: "Expect",
                        description: "",
                        component: Input,
                        enabled: false,
                        value: "",
                        issuer: "builtin",
                    },
                    {
                        label: "Forwarded",
                        description: "",
                        component: Input,
                        enabled: false,
                        value: "",
                        issuer: "builtin",
                    },
                    {
                        label: "From",
                        description: "",
                        component: Input,
                        enabled: false,
                        value: "",
                        issuer: "builtin",
                    },
                    {
                        label: "Host",
                        description: "",
                        component: Input,
                        enabled: false,
                        value: "",
                        issuer: "builtin",
                    },
                    {
                        label: "If-Match",
                        description: "",
                        component: Input,
                        enabled: false,
                        value: "",
                        issuer: "builtin",
                    },
                    {
                        label: "If-Modified-Since",
                        description: "",
                        component: Input,
                        enabled: false,
                        value: "",
                        issuer: "builtin",
                    },
                    {
                        label: "If-None-Match",
                        description: "",
                        component: Input,
                        enabled: false,
                        value: "",
                        issuer: "builtin",
                    },
                    {
                        label: "If-Range",
                        description: "",
                        component: Input,
                        enabled: false,
                        value: "",
                        issuer: "builtin",
                    },
                    {
                        label: "If-Unmodified-Since",
                        description: "",
                        component: Input,
                        enabled: false,
                        value: "",
                        issuer: "builtin",
                    },
                    {
                        label: "Max-Forwards",
                        description: "",
                        component: Input,
                        enabled: false,
                        value: "",
                        issuer: "builtin",
                    },
                    {
                        label: "Origin",
                        description: "",
                        component: Input,
                        enabled: false,
                        value: "",
                        issuer: "builtin",
                    },
                    {
                        label: "Pragma",
                        description: "",
                        component: Input,
                        enabled: false,
                        value: "",
                        issuer: "builtin",
                    },
                    {
                        label: "Proxy-Authorization",
                        description: "",
                        component: Input,
                        enabled: false,
                        value: "",
                        issuer: "builtin",
                    },
                    {
                        label: "Referer",
                        description: "",
                        component: Input,
                        enabled: false,
                        value: "",
                        issuer: "builtin",
                    },
                    {
                        label: "Upgrade",
                        description: "",
                        component: Input,
                        enabled: false,
                        value: "",
                        issuer: "builtin",
                    },
                    {
                        label: "User-Agent",
                        description: "",
                        component: Input,
                        enabled: false,
                        value: "",
                        issuer: "builtin",
                    },
                ],
            },
            matchers_optional_list: [
                {
                    label: "status",
                    description: "",
                    valueOption: [
                        {
                            code: 100,
                            label: "Continue",
                            description:
                                "The server has received the request headers and the client should proceed to send the request body.",
                        },
                        {
                            code: 101,
                            label: "Switching Protocols",
                            description: "The server is changing protocols according to the client's request.",
                        },
                        { code: 200, label: "OK", description: "The request was successful." },
                        {
                            code: 201,
                            label: "Created",
                            description: "The request has been fulfilled, and a new resource is created.",
                        },
                        {
                            code: 204,
                            label: "No Content",
                            description:
                                "The server successfully processed the request, but there is no content to return.",
                        },
                        {
                            code: 301,
                            label: "Moved Permanently",
                            description: "The requested resource has been permanently moved to a new location.",
                        },
                        {
                            code: 302,
                            label: "Found",
                            description: "The requested resource temporarily resides under a different URL.",
                        },
                        {
                            code: 304,
                            label: "Not Modified",
                            description: "Indicates that the resource has not been modified since the last request.",
                        },
                        {
                            code: 400,
                            label: "Bad Request",
                            description: "The server cannot process the request due to a client error.",
                        },
                        { code: 401, label: "Unauthorized", description: "The request requires user authentication." },
                        {
                            code: 403,
                            label: "Forbidden",
                            description: "The server understood the request, but refuses to authorize it.",
                        },
                        {
                            code: 404,
                            label: "Not Found",
                            description: "The requested resource could not be found on the server.",
                        },
                        {
                            code: 500,
                            label: "Internal Server Error",
                            description:
                                "A generic error message indicating that the server encountered an unexpected condition.",
                        },
                        {
                            code: 502,
                            label: "Bad Gateway",
                            description:
                                "The server received an invalid response from an upstream server while processing the request.",
                        },
                        {
                            code: 503,
                            label: "Service Unavailable",
                            description:
                                "The server is currently unable to handle the request due to temporary overloading or maintenance.",
                        },
                    ],
                    condition: "or",
                    conditionOptions: ["or"],
                    isNegative: false,
                    isInternal: false,
                    enabled: false,
                },
                {
                    label: "word",
                    description: "",
                    valueOption: [],
                    condition: "or",
                    conditionOptions: ["and", "or"],
                    part: "",
                    isNegative: false,
                    isInternal: false,
                    enabled: false,
                },
                {
                    label: "regex",
                    description: "",
                    valueOption: [],
                    condition: "or",
                    conditionOptions: ["and", "or"],
                    part: "",
                    isNegative: false,
                    isInternal: false,
                    enabled: false,
                },
                {
                    label: "dsl",
                    description: "",
                    valueOption: [],
                    condition: "or",
                    conditionOptions: ["and", "or"],
                    part: "",
                    isNegative: false,
                    isInternal: false,
                    enabled: false,
                },
                {
                    label: "xpath",
                    description: "",
                    valueOption: [],
                    condition: "or",
                    conditionOptions: ["and", "or"],
                    part: "",
                    isNegative: false,
                    isInternal: false,
                    enabled: false,
                },
                {
                    label: "binary",
                    description: "",
                    valueOption: [],
                    condition: "or",
                    conditionOptions: ["and", "or"],
                    part: "",
                    isNegative: false,
                    isInternal: false,
                    enabled: false,
                },
                {
                    label: "size",
                    description: "",
                    valueOption: [],
                    condition: "or",
                    conditionOptions: ["and", "or"],
                    part: "",
                    isNegative: false,
                    isInternal: false,
                    enabled: false,
                },
            ],
            extractors_optional_list: [
                {
                    label: "regex",
                    description: "",
                    valueOption: [],
                    part: "",
                    group: "",
                    name: "",
                    isInternal: false,
                    enabled: false,
                },
                {
                    label: "dsl",
                    description: "",
                    valueOption: [],
                    part: "",
                    group: "",
                    name: "",
                    isInternal: false,
                    enabled: false,
                },
                {
                    label: "xpath",
                    description: "",
                    valueOption: [],
                    part: "",
                    group: "",
                    name: "",
                    attribute: "value",
                    isInternal: false,
                    enabled: false,
                },
                {
                    label: "kval",
                    description: "",
                    valueOption: [],
                    part: "",
                    group: "",
                    name: "",
                    isInternal: false,
                    enabled: false,
                },
                {
                    label: "json",
                    description: "",
                    valueOption: [],
                    part: "",
                    group: "",
                    name: "",
                    isInternal: false,
                    enabled: false,
                },
            ],
        };
    }

    // Event Handler for User Input Fields (save to database)
    onchange_information = (key, value) => {
        const old = this.state.userinput;
        if (old["info"] === undefined) {
            old["info"] = {};
        }
        old["info"][key] = value;
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
        old["info"]["classification"][key] = value;
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
                description: "s",
                component: Input,
                enabled: true,
                value: "",
                issuer: "custom",
                type: type,
            });
        } else {
            old.common.push({
                label: "",
                description: "s",
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

        if (this.state.userinput.hasOwnProperty("info")) {
            user_input["info"] = this.state.userinput.info;

            if (user_input["info"].hasOwnProperty("tags")) {
                var tmpstr = "";
                user_input["info"]["tags"].map((value) => {
                    tmpstr += value.label + ",";
                });
                user_input["info"]["tags"] = tmpstr.slice(0, -1);
            }
        }

        user_input["http"] = {};
        if (
            this.state.userinput.hasOwnProperty("info") &&
            this.state.userinput.hasOwnProperty("http") &&
            this.state.userinput.http.hasOwnProperty("method")
        ) {
            if (this.state.httpRequestOptionCounter < 2 && this.state.userinput.http.method == "GET") {
                user_input["http"] = {
                    method: this.state.userinput.http.method,
                    path: this.state.userinput.http.path,
                };
            } else {
                let http_raw_request = this.format_http_request();
                user_input["http"] = {
                    raw: [http_raw_request],
                };
            }
        } else {
        }

        if (this.state.matchersConditionCounter > 1 && this.state.matchersCondition != "") {
            user_input["http"]["matchers-condition"] = this.state.matchersCondition;
        }

        // Matchers formatting
        user_input["http"]["matchers"] = [];
        for (let x in this.state.matchers_optional_list) {
            const t = this.state.matchers_optional_list[x];
            if (t.enabled) {
                const matcherCO = {};
                matcherCO["type"] = t.label;
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
                user_input["http"]["matchers"].push(matcherCO);
            }
        }

        // Extractors formatting
        user_input["http"]["extractors"] = [];
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
                user_input["http"]["extractors"].push(extractorCO);
            }
        }

        // console.log(this.state.extractors_optional_list);
        // console.log();
        this.props.onChange(user_input);
    };

    render() {
        return (
            <Container maxWidth="lg" sx={{ mx: 0, px: 0 }}>
                <CustomCard title={"Information"} description={"Info contains metadata information about a template"}>
                    <Grid xs={4}>
                        <CustomTextInputBox
                            label={"name"}
                            description={"s"}
                            onChange={this.onchange_information}
                        ></CustomTextInputBox>
                    </Grid>
                    <Grid xs={4}>
                        <CustomTextInputBox
                            label={"author"}
                            description={"s"}
                            onChange={this.onchange_information}
                        ></CustomTextInputBox>
                    </Grid>
                    <Grid xs={4}>
                        <CustomSelectionBox
                            label={"severity"}
                            options={["info", "low", "medium", "high", "critical", ""]}
                            onChange={this.onchange_information}
                        ></CustomSelectionBox>
                    </Grid>

                    <Grid xs={12}>
                        <CustomAutocompleteMC
                            label={"tags"}
                            description={"Tag"}
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
                    description={"Info contains metadata information about a template"}
                >
                    <Grid xs={4}>
                        <CustomTextInputBox
                            label={"cwe-id"}
                            description={"sss"}
                            onChange={this.onchange_classification}
                        ></CustomTextInputBox>
                    </Grid>
                    <Grid xs={8}>
                        <CustomAutocomplete
                            label={"cve-id"}
                            description={"fff"}
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

                <CustomCard title={"Request"} description={"Info contains metadata information about a template"}>
                    <Grid xs={4}>
                        <CustomSelectionBox
                            label={"method"}
                            description={"sss"}
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
                                    description={"sss"}
                                    options={["GET", "POST"]}
                                    value={"{{base}}"}
                                    onChange={this.onchange_http}
                                ></CustomTextareaInputBox>
                            </Grid>
                        )}
                    {this.state.userinput.http &&
                        this.state.userinput.http.method &&
                        (this.state.httpRequestOptionCounter > 0 || this.state.userinput.http.method == "POST") && (
                            <Grid xs={12}>
                                <Table borderAxis={"xBetween"} sx={{ p: 1 }}>
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
                                                                        title={header.description}
                                                                        placement="right"
                                                                        sx={{
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
                                <Typography level="body">Output</Typography>

                                <CodeBlock
                                    text={this.format_http_request()}
                                    language="go"
                                    showLineNumbers={false}
                                    theme={dracula}
                                />
                            </Grid>
                        )}
                </CustomCard>

                <CustomCard title={"matchers"} description={"Info contains metadata information about a template"}>
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
                                                <Tooltip title={val.description} placement="right">
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
                                                <Tooltip title={val.description} placement="right">
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
                                                    description={""}
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
                                                            "# group defines the matching group being used. # In GO the 'match' is the full array of all matches and submatches. # match[0] is the full match. # match[n] is the submatches. Most often we'd want match[1] as depicted below"
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
                                                    description={""}
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
