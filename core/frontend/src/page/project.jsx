import * as React from "react";
import {
    Box,
    Button,
    ButtonGroup,
    Menu,
    MenuItem,
    Tab,
    Tabs,
    Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { ProjectHeader } from "../component/page_style/project_style";

class ProjectItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = { anchorEl: null, open: false, curTab: 0 };
    }

    StyledTab = styled((props) => <Tab disableRipple {...props} />)(
        ({ theme }) => ({
            textTransform: "none",
            fontWeight: theme.typography.fontWeightRegular,
            fontSize: theme.typography.pxToRem(15),
            marginRight: theme.spacing(1),
            color: "#0d6efd",
            background: "0 0",
            border: "1px solid transparent",
            borderTopLeftRadius: "0.25rem",
            borderTopRightRadius: "0.25rem",
            padding: ".5rem 1rem",
            textDecoration: "none",
            transition: `color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out`,
            "&.Mui-selected": {
                color: "#495057",
                backgroundColor: "#fff",
                borderColor: "#dee2e6 #dee2e6 #fff",
                marginBottom: "-2px",
            },
            "&.Mui-focusVisible": {
                backgroundColor: "rgba(100, 95, 228, 0.32)",
            },
        })
    );
    AntTabs = styled(Tabs)({
        borderBottom: "1px solid #dee2e6",

        overflow: "visible!important",
        "& div.MuiTabs-scroller": {
            overflow: "visible!important",
        },
        "&.Mui-selected": {
            color: "#495057",
            backgroundColor: "red",
            borderColor: `#dee2e6 #dee2e6 #fff`,
            marginBottom: "-20px!important",
        },
        "& .MuiTabs-indicator": {
            display: "flex",
            justifyContent: "center",
            backgroundColor: "transparent",
        },
    });
    TabPanel = (props) => {
        const { children, value, index, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box sx={{ p: 3 }}>
                        <Typography>{children}</Typography>
                    </Box>
                )}
            </div>
        );
    };
    a11yProps = (index) => {
        return {
            id: `simple-tab-${index}`,
            "aria-controls": `simple-tabpanel-${index}`,
        };
    };

    handleClickHeaderButton = (event) => {
        // event.currentTarget;
        this.setState({ open: true, anchorEl: event.target });
    };
    handleCloseHeaderButton = () => {
        this.setState({ open: false, anchorEl: null });
    };
    handleChangeBodyTab = (event, newValue) => {
        this.setState({ curTab: newValue });
    };
    projectItemHeader = () => {
        return (
            <Box
                sx={{
                    width: "100%",
                    borderBottom: 1,
                    borderColor: "divider",
                    py: 2,
                    px: 3,
                }}
            >
                <ProjectHeader>
                    <h1>MyProject</h1>
                    <div>
                        <ButtonGroup
                            variant="outlined"
                            aria-label="outlined button group"
                            sx={{ px: 3 }}
                        >
                            <Button>Configure</Button>
                            <Button>Audit Trail</Button>
                        </ButtonGroup>

                        <Button
                            id="demo-positioned-button"
                            aria-controls={
                                this.state.open
                                    ? "demo-positioned-menu"
                                    : undefined
                            }
                            variant="outlined"
                            aria-haspopup="true"
                            aria-expanded={this.state.open ? "true" : undefined}
                            onClick={this.handleClickHeaderButton}
                        >
                            Launch
                        </Button>
                        <Menu
                            id="demo-positioned-menu"
                            aria-labelledby="demo-positioned-button"
                            anchorEl={this.state.anchorEl}
                            open={this.state.open}
                            onClose={this.handleCloseHeaderButton}
                            anchorOrigin={{
                                vertical: "top",
                                horizontal: "left",
                            }}
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "left",
                            }}
                        >
                            <MenuItem onClick={this.handleCloseHeaderButton}>
                                Profile
                            </MenuItem>
                            <MenuItem onClick={this.handleCloseHeaderButton}>
                                My account
                            </MenuItem>
                            <MenuItem onClick={this.handleCloseHeaderButton}>
                                Logout
                            </MenuItem>
                        </Menu>

                        <ButtonGroup
                            variant="outlined"
                            aria-label="outlined button group"
                            sx={{ px: 3 }}
                        >
                            <Button>Report</Button>
                            <Button>Export</Button>
                        </ButtonGroup>
                    </div>
                </ProjectHeader>
            </Box>
        );
    };

    render() {
        return (
            <div>
                <this.projectItemHeader />
                <div style={{ paddingInline: "25px", marginTop: "25px" }}>
                    <Box sx={{ width: "100%" }}>
                        <this.AntTabs
                            value={this.state.curTab}
                            onChange={this.handleChangeBodyTab}
                            aria-label="styled tabs example"
                            sx={{ overflow: "overlay" }}
                        >
                            <this.StyledTab
                                label="Scan Summary"
                                {...this.a11yProps(0)}
                            ></this.StyledTab>
                            <this.StyledTab
                                label="Hosts"
                                {...this.a11yProps(1)}
                            ></this.StyledTab>
                            <this.StyledTab
                                label="Vulnerabilities"
                                {...this.a11yProps(2)}
                            ></this.StyledTab>
                            <this.StyledTab
                                label="Notes"
                                {...this.a11yProps(3)}
                            ></this.StyledTab>
                            <this.StyledTab
                                label="VPT Top Threats"
                                {...this.a11yProps(4)}
                            ></this.StyledTab>
                            <this.StyledTab
                                label="History"
                                {...this.a11yProps(5)}
                            ></this.StyledTab>
                        </this.AntTabs>
                    </Box>
                    <this.TabPanel value={this.state.curTab} index={0}>
                        1
                    </this.TabPanel>
                    <this.TabPanel value={this.state.curTab} index={1}>
                        2
                    </this.TabPanel>
                    <this.TabPanel value={this.state.curTab} index={2}>
                        3
                    </this.TabPanel>
                    <this.TabPanel value={this.state.curTab} index={3}>
                        4
                    </this.TabPanel>
                    <this.TabPanel value={this.state.curTab} index={4}>
                        5
                    </this.TabPanel>
                    <this.TabPanel value={this.state.curTab} index={5}>
                        6
                    </this.TabPanel>
                </div>
            </div>
        );
    }
}

export default ProjectItem;
