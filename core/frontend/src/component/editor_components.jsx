import * as React from "react";

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

function formatDescription(props) {
    console.log(props);
    return (
        <Box
            sx={{
                // display: "flex",
                // flexDirection: "column",
                // justifyContent: "center",
                p: 1,
            }}
        >
            <Typography
                color="#FFFFFF"
                endDecorator={
                    props.link && (
                        <Link
                            level="h1"
                            variant="outlined"
                            aria-labelledby="heading-demo"
                            href={props.link}
                            fontSize="lg"
                            borderRadius="sm"
                            sx={{ color: "#00ADB5" }}
                            onClick={() => {
                                console.log(props.link);
                            }}
                        >
                            <LinkIcon sx={{ fontSize: 30 }} />
                            abcde
                        </Link>
                    )
                }
                sx={{ width: "auto", maxWidth: 360 }}
            >
                {props.description}
            </Typography>
        </Box>
    );
}

// options components
export function CustomAutocomplete(props) {
    return (
        <FormControl sx={{ gridColumn: "1/-1" }}>
            <FormLabel>
                {props.label}
                <Tooltip title={props.description} placement="right" sx={{ maxWidth: 360, zIndex: 20, ml: 1 }}>
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
        <FormControl sx={{ gridColumn: "1/-1" }}>
            <FormLabel>
                {firstCharToUpper(props.label)}
                <Tooltip title={props.description} placement="right" sx={{ maxWidth: 360, zIndex: 20, ml: 1 }}>
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
export function CustomAutocompleteFreeMC(props) {
    return (
        <FormControl sx={{ gridColumn: "1/-1" }}>
            <FormLabel>
                {firstCharToUpper(props.label)}
                <Tooltip title={props.description} placement="right" sx={{ maxWidth: 360, zIndex: 20, ml: 1 }}>
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
                <Tooltip title={props.description} placement="right" sx={{ maxWidth: 360, zIndex: 20, ml: 1 }}>
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
                <Tooltip title={props.description} placement="right" sx={{ maxWidth: 360, zIndex: 20, ml: 1 }}>
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
                <Tooltip title={props.description} placement="right" sx={{ maxWidth: 360, zIndex: 20, ml: 1 }}>
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
                    <Tooltip title={"Condition"} placement="right" sx={{ zIndex: 20, ml: 1 }}>
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
    console.log(props);
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
                    <Tooltip title={props.description} sx={{ maxWidth: 360 }} placement="right">
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
