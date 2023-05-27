import * as React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Button from "@mui/material/Button";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

const defaultTheme = createTheme();

const theme = createTheme({
    components: {
        MuiButton: {
            variants: [
                {
                    props: { variant: "dashed" },
                    style: {
                        textTransform: "none",
                        border: `2px solid ${defaultTheme.palette.primary.main}`,
                        color: defaultTheme.palette.primary.main,
                        innerWidth: "222.4px",
                    },
                },
                {
                    props: { variant: "dashed", size: "large" },
                    style: {
                        borderWidth: 4,
                    },
                },
                {
                    props: {
                        variant: "dashed",
                        color: "secondary",
                        size: "large",
                    },
                    style: {
                        fontSize: 18,
                    },
                },
            ],
        },
    },
});

export default function GlobalThemeVariants() {
    return (
        <ThemeProvider theme={theme}>
            <Button sx={{ m: 1 }}>
                <AddRoundedIcon />
            </Button>
        </ThemeProvider>
    );
}
