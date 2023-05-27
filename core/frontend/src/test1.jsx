import * as React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

export default function BasicMenu() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const defaultTheme = createTheme();

    const theme = createTheme({
        components: {
            MuiButton: {
                variants: [
                    {
                        props: { variant: "solid" },
                        style: {
                            textTransform: "none",
                            border: `2px solid ${defaultTheme.palette.primary.main}`,
                            color: defaultTheme.palette.primary.main,
                        },
                    },
                ],
            },
        },
    });

    return (
        <div>
            <ThemeProvider theme={theme}>
                <Button
                    id="basic-button"
                    aria-controls={open ? "basic-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    onClick={handleClick}
                    variant="solid"
                    sx={{ m: 1 }}
                >
                    <AddRoundedIcon />
                </Button>
            </ThemeProvider>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    "aria-labelledby": "basic-button",
                }}
            >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
                <MenuItem onClick={handleClose}>Logout</MenuItem>
            </Menu>
        </div>
    );
}
