import React from "react";
import Chart from "react-apexcharts";

const App = () => {
    // Defined default value
    const list = { info: 25, low: 25, medium: 25, high: 25, critical: 25 };
    let series = [];
    let colorsGapChart = [];

    const sKeys = Object.keys(list);
    sKeys.forEach((key) => {
        if (list[key] > 0) {
            series.push({ name: key, data: [list[key]] });
            console.log(key);
            switch (key) {
                case "info":
                    colorsGapChart.push("#1e7ace");
                    break;
                case "low":
                    colorsGapChart.push("#fdc500");
                    break;
                case "medium":
                    colorsGapChart.push("#fd8c00");
                    break;
                case "high":
                    colorsGapChart.push("#dc0000");
                    break;
                case "critical":
                    colorsGapChart.push("#780000");
                    break;
            }
        }
    });

    const options = {
        chart: {
            id: "basic-bar",
            type: "bar",
            stacked: true,
            stackType: 5,
            height: "auto",
            toolbar: {
                show: false,
            },
        },
        plotOptions: {
            bar: {
                horizontal: true,
                columnWidth: "100%",
                barHeight: "100%",
            },
            radialBar: {
                dataLabels: {
                    name: {
                        show: false,
                    },
                    value: {
                        show: false,
                    },
                },
            },
        },
        // stroke: {
        //     width: 0,
        //     colors: [],
        // },
        legend: {
            show: false,
        },
        colors: colorsGapChart,
        xaxis: {
            type: "category",
            categories: ["Risk Level"],
            labels: {
                show: false,
            },
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
            max: 100,
        },
        yaxis: {
            show: false,
            max: 5,
            tooltip: {
                enabled: false,
            },
        },
        grid: {
            show: false,
        },
        dataLabels: {
            enabled: true,
        },
    };

    const handleRefresh = () => {
        window.location.reload();
    };

    return (
        <div style={{ width: "100%" }}>
            <Chart
                options={options}
                series={series}
                type="bar"
                width="100%"
                height="80"
            />
        </div>
    );

    window.location.reload()
};

export default App;
