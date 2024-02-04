import React from "react";

import { UnderLineMiniTitle } from "../component/page_style/project_style";
import CanvasJSReact from "@canvasjs/react-charts";

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const VulnerabilitiesPiChart = () => {
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
                dataPoints: [
                    { name: "Critical", y: 2 },
                    { name: "High", y: 3 },
                    { name: "Medium", y: 13 },
                    { name: "Low", y: 7 },
                    { name: "info", y: 75 },
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

const Body = (props) => {
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
                            <td>January 16 at 5:30 PM</td>
                        </tr>
                        <tr>
                            <td>End:</td>
                            <td>January 16 at 6:28 PM</td>
                        </tr>
                        <tr>
                            <td>Elapsed:</td>
                            <td>an hour</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div>
                <UnderLineMiniTitle>Vulnerabilities</UnderLineMiniTitle>
                <VulnerabilitiesPiChart></VulnerabilitiesPiChart>
            </div>
        </div>
    );
};

export default Body;
