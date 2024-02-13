import * as React from "react";

import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Unstable_Grid2";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";

import CanvasJSReact from "@canvasjs/react-charts";
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

import {
    CustScanDetails,
    MiniTitle,
} from "../component/page_style/project_style";

export default class ProjectSummary extends React.Component {
    constructor(props) {
        super(props);

        this.state = { result: props.inputData };

        this.Item = styled(Paper)(({ theme }) => ({
            backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
            ...theme.typography.body2,
            padding: theme.spacing(1),
            textAlign: "center",
            color: theme.palette.text.secondary,
        }));
    }

    mediaCard = (props) => {
        const { cname, cvalue } = props;
        return (
            <Card
                sx={{
                    maxWidth: 345,
                    width: 250,
                    minWidth: 200,
                    mt: "20px",
                    mr: "20px",
                }}
            >
                <CardMedia
                    sx={{
                        height: 80,
                        backgroundColor: "#425363",
                        alignItems: "center",
                        display: "flex",
                        justifyContent: "center",
                    }}
                    title="green iguana"
                >
                    <Typography
                        gutterBottom
                        variant="h3"
                        component="div"
                        sx={{ m: 0, color: "white" }}
                    >
                        {cvalue}
                    </Typography>
                </CardMedia>
                <Typography
                    gutterBottom
                    variant="p"
                    component="div"
                    sx={{ textAlign: "center" }}
                >
                    {cname}
                </Typography>
            </Card>
        );
    };

    scanDetails = () => {
        return (
            <CustScanDetails className="custscandetails">
                <div>
                    <div>
                        <img
                            src="../image/vulnerabilities/vulnerabilities_4.png"
                            alt=""
                        />
                        <p>
                            {this.state.result
                                ? this.state.result.cvecount.critical
                                : ""}
                        </p>
                    </div>
                    <h5>Cirtical Vulnerabilities</h5>
                </div>
                <div>
                    <div>
                        <img
                            src="../image/vulnerabilities/vulnerabilities_3.png"
                            alt=""
                        />
                        <p>
                            {this.state.result
                                ? this.state.result.cvecount.high
                                : ""}
                        </p>
                    </div>
                    <h5>High Vulnerabilities</h5>
                </div>
                <div>
                    <div>
                        <img
                            src="../image/vulnerabilities/vulnerabilities_2.png"
                            alt=""
                        />
                        <p>
                            {this.state.result
                                ? this.state.result.cvecount.medium
                                : ""}
                        </p>
                    </div>
                    <h5>Medium Vulnerabilities</h5>
                </div>
                <div>
                    <div>
                        <img
                            src="../image/vulnerabilities/vulnerabilities_1.png"
                            alt=""
                        />
                        <p>
                            {this.state.result
                                ? this.state.result.cvecount.low
                                : ""}
                        </p>
                    </div>
                    <h5>Low Vulnerabilities</h5>
                </div>
            </CustScanDetails>
        );
    };

    formateArrayToList = (indata) => {
        return (
            <ul style={{ marginLeft: "20px" }}>
                {indata.map((element, i) => {
                    // Return the element. Also pass key
                    return <li key={i}>{element.info.name}</li>;
                })}
            </ul>
        );
    };

    details = () => {
        var startt = "",
            endt = "";

        const templateName = "";

        if (this.state.result != null) {
            startt = new Date(
                this.state.result.startTime * 1000
            ).toLocaleString();
            endt = new Date(this.state.result.endTime * 1000).toLocaleString();
            // templateName = "";
        }
        return (
            <div>
                {/* <p>Scan Name: </p> */}
                <p>Template Set: </p>
                <p>CVSS_Socre: </p>
                <div>
                    <p>Scan Template:</p>
                    {this.state.result &&
                        this.formateArrayToList(this.state.result.result)}
                </div>
                <p>Scan Start: {startt}</p>
                <p>Scan End: {endt}</p>
            </div>
        );
    };

    detectedDuringScan = () => {
        // const { data: chartData } = this.state;
        const options = {
            animationEnabled: true,
            subtitles: [
                {
                    text: "Top 5 OS",
                    verticalAlign: "center",
                    fontSize: 24,
                    dockInsidePlotArea: true,
                },
            ],
            legend: {
                cursor: "pointer",
                verticalAlign: "center",
                horizontalAlign: "right",
            },
            data: [
                {
                    type: "doughnut",
                    showInLegend: true,
                    indexLabel: "{name}: {y}",
                    yValueFormatString: "#,###'%'",
                    radius: "120%",
                    innerRadius: "65%",
                    dataPoints: [
                        { name: "Unsatisfied", y: 5 },
                        { name: "Very Unsatisfied", y: 31 },
                        { name: "Very Satisfied", y: 40 },
                        { name: "Satisfied", y: 17 },
                        { name: "Neutral", y: 7 },
                    ],
                },
            ],
        };
        return (
            <div>
                <CanvasJSChart
                    options={options}
                    /* onRef={ref => this.chart = ref} */
                />
                {/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
            </div>
        );
    };

    hostScanStatus = () => {
        return (
            <div style={{ display: "flex" }}>
                <this.mediaCard cname="SUCCEEDED" cvalue="0" />
                <this.mediaCard cname="FAILED" cvalue="0" />
            </div>
        );
    };

    humanDiff = (t1, t2) => {
        const diff = Math.max(t1, t2) - Math.min(t1, t2);
        const SEC = 1000,
            MIN = 60 * SEC,
            HRS = 60 * MIN;

        const hrs = Math.floor(diff / HRS);
        const min = Math.floor((diff % HRS) / MIN).toLocaleString("en-US", {
            minimumIntegerDigits: 2,
        });
        const sec = Math.floor((diff % MIN) / SEC).toLocaleString("en-US", {
            minimumIntegerDigits: 2,
        });
        // const ms = Math.floor(diff % SEC).toLocaleString("en-US", {
        //     minimumIntegerDigits: 4,
        //     useGrouping: false,
        // });
        // return `${hrs}:${min}:${sec}.${ms}`;

        return `${hrs}:${min}:${sec}`;
    };

    hostCount = (result) => {
        const hosts = [];
        result.map((element, i) => {
            if (!hosts.includes(element.ip)) {
                hosts.push(element.ip);
            }
        });
        return hosts.length;
    };

    scanDuration = () => {
        var scan_duration = "00:00:00";
        var scanTimePerHost = "00:00:00";
        var hostCount = 0;
        if (this.state.result) {
            const t1 = new Date(this.state.result.startTime * 1000);
            const t2 = new Date(this.state.result.endTime * 1000);
            scan_duration = this.humanDiff(t1, t2);
            hostCount = this.hostCount(this.state.result.result);
            var perhostTime = (Math.max(t1, t2) - Math.min(t1, t2)) / hostCount;
            scanTimePerHost = this.humanDiff(0, perhostTime);
        }

        return (
            <div style={{ display: "flex" }}>
                <this.mediaCard cname="SCAN DURATION" cvalue={scan_duration} />
                <this.mediaCard
                    cname="MEDIAN SCAN TIME PER HOST"
                    cvalue={scanTimePerHost}
                />
                {/* <this.mediaCard cname="MAX SCAN TIME" cvalue="00:00:00" /> */}
            </div>
        );
    };

    static getDerivedStateFromProps(props, state) {
        if (props.inputData !== state.result && props.inputData != null) {
            return {
                result: props.inputData,
            };
        }
        return null;
    }

    render() {
        return (
            <Box sx={{ flexGrow: 1, p: 2 }}>
                <Grid container spacing={2}>
                    <Grid {...{ xs: 12, sm: 12, md: 6, lg: 6 }} minHeight={160}>
                        <MiniTitle>
                            <b>Scan Details</b>
                        </MiniTitle>
                        <this.scanDetails></this.scanDetails>
                        <b>Details</b>
                        <this.details></this.details>
                    </Grid>
                    <Grid {...{ xs: 12, sm: 12, md: 6, lg: 6 }} minHeight={160}>
                        {/* <MiniTitle>
                            Top 5 Operating System Detected During Scan
                        </MiniTitle>
                        <this.detectedDuringScan></this.detectedDuringScan> */}
                    </Grid>
                    {/* <Grid {...{ xs: 12, sm: 12, md: 6, lg: 6 }} minHeight={160}>
                        <MiniTitle>
                            Authentication / Credential Info (Hosts)
                        </MiniTitle>
                        <this.hostScanStatus></this.hostScanStatus>
                    </Grid> */}
                    <Grid {...{ xs: 12, sm: 12, md: 6, lg: 6 }} minHeight={160}>
                        <MiniTitle>Scan Durations</MiniTitle>
                        <this.scanDuration></this.scanDuration>
                    </Grid>
                </Grid>
            </Box>
        );
    }
}
