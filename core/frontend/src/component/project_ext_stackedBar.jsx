import React from "react";
import Chart from "react-apexcharts";

const App = () => {
    // Defined default value
    const targetNum = 4.0;
    const currentNum = 4.2;
    let colorsGapChart = ["#F3F3F3"];

    const minusNumResult = parseFloat(targetNum - currentNum).toFixed(1);
    const gapNum =
        minusNumResult >= 0 ? minusNumResult : Math.abs(minusNumResult);
    const defaultValue = (5 - parseFloat(currentNum + minusNumResult)).toFixed(
        1
    );

    if (minusNumResult > 0) {
        colorsGapChart = ["#051C2C", "#E44155", "#F3F3F3"];
    } else if (minusNumResult < 0) {
        colorsGapChart = ["#051C2C", "#71D2F1", "#F3F3F3"];
    } else {
        colorsGapChart = ["#F3F3F3"];
    }

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
        stroke: {
            width: 1,
            colors: [],
        },
        title: {
            text: "",
        },
        xaxis: {
            type: "category",
            categories: [],
            labels: {
                show: false,
            },
            axisBorder: {
                show: false,
            },
        },
        legend: {
            show: false,
        },
        colors: colorsGapChart,
        yaxis: {
            show: false,
            max: 5,
        },
        grid: {
            show: false,
        },
        dataLabels: {
            enabled: true,
        },
    };
    const series = [
        {
            name: "Current maturity",
            data: [currentNum],
        },
        {
            name: "Target maturity",
            data: [gapNum],
        },
        {
            name: "Gap",
            data: [defaultValue],
        },
    ];

    return (
        <div className="app">
            <div className="row">
                <div className="mixed-chart">
                    <Chart
                        options={options}
                        series={series}
                        type="bar"
                        width="350"
                        height="105"
                    />
                </div>
            </div>
        </div>
    );
};

export default App;
