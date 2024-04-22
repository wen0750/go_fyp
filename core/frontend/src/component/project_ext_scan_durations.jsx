import React from "react";

import { UnderLineMiniTitle } from "../component/page_style/project_style";
import CanvasJSReact from "@canvasjs/react-charts";

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

function humanDiff(t1, t2) {
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
}

const VulnerabilitiesPiChart = (props) => {
    // const { data: chartData } = this.state;
    const options = {
        animationEnabled: true,
        legend: {
            cursor: "pointer",
            verticalAlign: "center",
            horizontalAlign: "right",
        },
        data: [
            {
                type: "doughnut",
                showInLegend: true,
                yValueFormatString: "#,###'%'",
                radius: "120%",
                innerRadius: "50%",
                dataPoints: props.data,
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

const Body = (props) => {
    console.log(props.data);
    let starttF = "...";
    let endtF = "...";
    let takeTime = "...";
    const cve = [];
    if (props.data) {
        let startt = new Date(props.data.startTime * 1000);
        let endt = new Date(props.data.endTime * 1000);
        starttF = startt.toLocaleString();
        endtF = endt.toLocaleString();
        takeTime = humanDiff(startt, endt);

        const chartData = props.data ? props.data.cvecount : {};
        for (const [key, value] of Object.entries(chartData)) {
            cve.push({ name: key, y: value });
        }
    }

    return (
        <div>
            <div style={{ marginBottom: "1rem" }}>
                <UnderLineMiniTitle>Scan Durations</UnderLineMiniTitle>
                <table>
                    <tbody>
                        <tr>
                            <td width="5%">Policy:</td>
                            <td width="20%">Basic Network Scan</td>
                        </tr>
                        <tr>
                            <td>Status:</td>
                            <td>Completed</td>
                        </tr>
                        <tr>
                            <td>Severity Base:</td>
                            <td>CVSS v3.0</td>
                        </tr>
                        <tr>
                            <td>Scanner:</td>
                            <td>Local Scanner</td>
                        </tr>
                        <tr>
                            <td>Start:</td>
                            <td>{starttF}</td>
                        </tr>
                        <tr>
                            <td>End:</td>
                            <td>{endtF}</td>
                        </tr>
                        <tr>
                            <td>Elapsed:</td>
                            <td>{takeTime}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div>
                <UnderLineMiniTitle>Vulnerabilities</UnderLineMiniTitle>
                <VulnerabilitiesPiChart data={cve}></VulnerabilitiesPiChart>
            </div>
        </div>
    );
};

export default Body;
