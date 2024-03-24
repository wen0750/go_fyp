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

// input option
import Radio from "@mui/joy/Radio";
import RadioGroup from "@mui/joy/RadioGroup";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Textarea from "@mui/joy/Textarea";
import Checkbox from "@mui/joy/Checkbox";
import Autocomplete from "@mui/joy/Autocomplete";

// drop down menu
import MenuButton from "@mui/joy/MenuButton";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
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
import { common } from "@mui/material/colors";

function firstCharToUpper(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
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
                    console.log(event);
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
                {props.label}
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
                defaultValue={[top100Films[13]]}
                onChange={(event, newValue) => {
                    console.log(event);
                    props.onChange(props.label, newValue);
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
            />
        </FormControl>
    );
}

function ControlledDropdown(props) {
    return (
        <Dropdown>
            <MenuButton startDecorator={<AddIcon />}>More Options</MenuButton>
            <Menu sx={{ minWidth: 160, "--ListItemDecorator-size": "24px" }}>
                <ListItem nested sx={{ width: 1, p: 0 }}>
                    <List aria-label="Font sizes" sx={{ width: 1 }}>
                        {props.options.map((item, ix) => (
                            <MenuItem
                                key={item.label + ix}
                                // role="menuitemradio"
                                aria-checked={item.enabled}
                                onClick={() => {
                                    props.onChange(ix);
                                }}
                            >
                                {item.label}
                                <ListItemDecorator>{item.enabled === true && <CheckIcon />}</ListItemDecorator>
                            </MenuItem>
                        ))}
                    </List>
                </ListItem>
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
                        <List sx={{ width: 1 }}>
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
                                            props.onXChange();
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
        this.state = {
            userinput: {},
            httpRequestOptionCounter: 0,
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
                        label: "add",
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
        };
    }

    // Event Handler
    onchange_information = (key, value) => {
        const old = this.state.userinput;
        if (old["info"] === undefined) {
            old["info"] = {};
        }
        old["info"][key] = value;
        console.log(old);
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
        console.log(old);
        this.setState({ userinput: old });
    };
    onchange_http = (key, value) => {
        const old = this.state.userinput;
        if (old["http"] === undefined) {
            old["http"] = {};
        }
        old["http"][key] = value;
        console.log(old);
        this.setState({ userinput: old });
    };

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
    onXchange_http_request_option = () => {
        const old = this.state.http_request_optional_list;
        var newHROC = this.state.httpRequestOptionCounter + 1;
        old.common.push({
            label: "",
            description: "s",
            component: Input,
            enabled: true,
            value: "",
            issuer: "custom",
        });
        this.setState({
            http_request_optional_list: old,
            httpRequestOptionCounter: newHROC,
        });
    };
    onTableChange_http_request_option = (key, local, value) => {
        const old = this.state.http_request_optional_list;
        old.common[key][local] = value;
        console.log(local);
        console.log(value);
        console.log(old.common);
        this.setState({
            http_request_optional_list: old,
        });
    };

    render() {
        return (
            <Container maxWidth="lg" sx={{ mx: 0, px: 0 }}>
                <CustomCard title={"Information"} description={"Info contains metadata information about a template"}>
                    <Grid xs={4}>
                        <CustomTextInputBox label={"name"} description={"s"} onChange={this.onchange_information}></CustomTextInputBox>
                    </Grid>
                    <Grid xs={4}>
                        <CustomTextInputBox label={"author"} description={"s"} onChange={this.onchange_information}></CustomTextInputBox>
                    </Grid>
                    <Grid xs={4}>
                        <CustomSelectionBox
                            label={"severity"}
                            options={["info", "low", "medium", "high", "critical", ""]}
                            onChange={this.onchange_information}
                        ></CustomSelectionBox>
                    </Grid>

                    <Grid xs={12}>
                        <CustomAutocompleteMC label={"Tag"} description={"Tag"} onChange={this.onchange_information}></CustomAutocompleteMC>
                    </Grid>
                    <Grid xs={12}>
                        <CustomTextareaInputBox label={"description"} description={"description"} onChange={this.onchange_information}></CustomTextareaInputBox>
                    </Grid>

                    {this.state.info_optional_list.map((val, i) => {
                        if (val.enabled == true) {
                            return (
                                <Grid xs={12}>
                                    <val.component label={val.label} description={val.description} onChange={this.onchange_information} />
                                </Grid>
                            );
                        }
                    })}
                    <Grid xs={4}>
                        <ControlledDropdown options={this.state.info_optional_list} onChange={this.onchange_information_option}></ControlledDropdown>
                    </Grid>
                </CustomCard>

                <CustomCard title={"classification"} description={"Info contains metadata information about a template"}>
                    <Grid xs={4}>
                        <CustomTextInputBox label={"cwe-id"} description={"sss"} onChange={this.onchange_classification}></CustomTextInputBox>
                    </Grid>
                    <Grid xs={8}>
                        <CustomAutocomplete label={"cve-id"} description={"fff"} onChange={this.onchange_classification}></CustomAutocomplete>
                    </Grid>
                    {this.state.classification_optional_list.map((val, i) => {
                        if (val.enabled == true) {
                            return (
                                <Grid xs={4}>
                                    <val.component label={val.label} description={val.description} onChange={this.onchange_classification} />
                                </Grid>
                            );
                        }
                    })}
                    <Grid xs={4}>
                        <ControlledDropdown options={this.state.classification_optional_list} onChange={this.onchange_classification_option}></ControlledDropdown>
                    </Grid>
                </CustomCard>

                <CustomCard title={"Request"} description={"Info contains metadata information about a template"}>
                    <Grid xs={4}>
                        <CustomSelectionBox label={"method"} description={"sss"} options={["GET", "POST"]} onChange={this.onchange_http}></CustomSelectionBox>
                    </Grid>

                    {this.state.userinput.http && this.state.userinput.http.method && this.state.userinput.http.method == "GET" && this.state.httpRequestOptionCounter == 0 && (
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
                    {this.state.userinput.http && this.state.userinput.http.method && (this.state.httpRequestOptionCounter > 0 || this.state.userinput.http.method == "POST") && (
                        <Grid xs={12}>
                            <Table borderAxis={"xBetween"} sx={{ p: 1 }}>
                                <thead>
                                    <tr>
                                        <th style={{ width: "20%" }}>Header Name</th>
                                        <th>Header Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.http_request_optional_list.common.map((header, hi) => {
                                        if (header.enabled) {
                                            if (header.issuer == "custom") {
                                                return (
                                                    <tr key={header.label}>
                                                        <th scope="row">
                                                            <header.component
                                                                size="lg"
                                                                onBlur={(event) => this.onTableChange_http_request_option(hi, "label", event.target.value)}
                                                                defaultValue={this.state.http_request_optional_list.common[hi].label}
                                                                ref={this.state.http_request_optional_list.common[hi].label}
                                                            />
                                                        </th>
                                                        <td>
                                                            <header.component
                                                                size="lg"
                                                                onBlur={(event) => this.onTableChange_http_request_option(hi, "value", event.target.value)}
                                                                defaultValue={this.state.http_request_optional_list.common[hi].value}
                                                                ref={this.state.http_request_optional_list.common[hi].value}
                                                            />
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
                                                                onBlur={(event) => console.log(event)}
                                                                size="lg"
                                                                // onChange={}
                                                            />
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

                    {this.state.info_optional_list.map((val, i) => {
                        if (val.enabled == true) {
                            return (
                                <Grid xs={12}>
                                    <val.component label={val.label} description={val.description} onChange={this.onchange_information} />
                                </Grid>
                            );
                        }
                    })}

                    {this.state.userinput.http && this.state.userinput.http.method && (
                        <Grid xs={4}>
                            <GroupControlledDropdown
                                options={this.state.http_request_optional_list}
                                onXChange={this.onXchange_http_request_option}
                                onChange={this.onchange_http_request_option}
                            ></GroupControlledDropdown>
                        </Grid>
                    )}

                    {this.state.userinput.http && this.state.userinput.http.method && (this.state.httpRequestOptionCounter > 0 || this.state.userinput.http.method == "POST") && (
                        <Grid xs={12}>
                            <Divider sx={{ my: 1 }} />
                            <Typography level="body">Output</Typography>

                            <CodeBlock text={"GET /file-manager/ HTTP/1.1\nHost: {{Hostname}}\nCookie: clp-fm={{session}}"} language="go" showLineNumbers={false} theme={dracula} />
                        </Grid>
                    )}
                </CustomCard>
            </Container>
        );
    }
}
