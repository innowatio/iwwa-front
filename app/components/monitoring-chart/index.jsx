import React from "react";
import {Button} from "react-bootstrap";
import ReactHighstock from "react-highcharts/bundle/ReactHighstock"; // Highstock is bundled
import {ObjectSelect} from "components";

const chartTypes = [
    {label: "Area", id: "areaspline"},
    {label: "Istogramma", id: "column"},
    {label: "In pila", id: "stacked"},
    {label: "In pila percentuale", id: "percent"}
];

let config;

var MonitoringChart = React.createClass({
    propTypes: {
        addToFavorite: React.PropTypes.func.isRequired,
        chartState: React.PropTypes.object.isRequired,
        config: React.PropTypes.object,
        selectChartType: React.PropTypes.func.isRequired,
        series: React.PropTypes.array.isRequired
    },
    getRandomValue: function () {
        return Math.floor((Math.random() * 100) + 1);
    },
    getHighstockCoordinate: function () {
        var self = this;
        var series = [];
        var occurences = 1000;
        var currentTime = new Date();

        this.props.series.forEach (function (item) {
            series.push({
                name: item.fields.name,
                data: [[currentTime.getTime(), self.getRandomValue()]]
            });
        });

        series.push();
        for (let i = 1; i < occurences; i++) {
            currentTime.setDate(currentTime.getDate() + 1);

            this.props.series.forEach (function (item, index) {
                series[index].data.push([currentTime.getTime(), self.getRandomValue()]);
            });
        }

        return {
            series: series
        };
    },
    getCommonConfig: function () {
            //xAxis: [{
            //    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            //        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            //    crosshair: true
            //}],
            //yAxis: this.props.chartState.yAxis,
        return {
            chart: {
                type: this.props.chartState.type,
                height: 600
            },
            credits: {
                enabled: false
            },
            legend: {
                enabled: true
            },
            rangeSelector: {
                buttons: [
                    {type: "day", count: 1, text: "1d"},
                    {type: "week", count: 1, text: "1w"},
                    {type: "month", count: 1, text: "1m"},
                    {type: "year", count: 1, text: "1y"},
                    {type: "ytd", text: "YTD"},
                    {type: "all", text: "All"}
                ],
                selected: 2
            },
            title: {
                text: "Highstock"
            },
            yAxis: [
                { // Primary yAxis
                    labels: {
                        format: "{value}°C"
                    },
                    title: {
                        text: "Temperature"
                    },
                    opposite: true
                },
                { // Secondary yAxis
                    gridLineWidth: 0,
                    title: {
                        text: "Rainfall"
                    },
                    labels: {
                        format: "{value} mm"
                    }
                },
                { // Tertiary yAxis
                    gridLineWidth: 0,
                    title: {
                        text: "Sea-Level Pressure"
                    },
                    labels: {
                        format: "{value} mb"
                    },
                    opposite: true
                }
            ],
            tooltip: {
                shared: true
            }
        };
    },
    getAreasplineConfig: function () {
        return {};
    },
    getColumnConfig: function () {
        return {};
    },
    getStackedConfig: function () {
        return {
            chart: {
                type: "column",
                height: 600
            },
            yAxis: {
                ...this.props.chartState.yAxis,
                stackLabels: {
                    enabled: true,
                    style: {
                        fontWeight: "bold"
                    }
                }
            },
            plotOptions: {
                column: {
                    stacking: "normal",
                    dataLabels: {
                        enabled: true,
                        style: {
                            textShadow: "0 0 3px black"
                        }
                    }
                }
            }
        };
    },
    getPercentConfig: function () {
        return {
            chart: {
                type: "column",
                height: 600
            },
            plotOptions: {
                column: {
                    stacking: "percent"
                }
            }
        };
    },
    getSpecificTypeConfig: function () {
        switch (this.props.chartState.type) {
            case "column":
                return this.getColumnConfig();
            case "stacked":
                return this.getStackedConfig();
            case "percent":
                return this.getPercentConfig();
            case "areaspline":
            default:
                return this.getAreasplineConfig();
        }
    },
    getHighstockConfig: function () {
        if (this.props.config) {
            config = this.props.config;
        } else {
            config = {
                ...this.getCommonConfig(),
                ...this.getSpecificTypeConfig(),
                ...this.getHighstockCoordinate()
            };
        }
        return config;
    },
    addToFavorite: function () {
        this.props.addToFavorite(config);
    },
    render: function () {
        let type = chartTypes.find((item) => {
            return item.id === this.props.chartState.type;
        });
        return (
            <div>
                <ObjectSelect
                    options={chartTypes}
                    onBlur={() => {}}
                    onChange={this.props.selectChartType}
                    value={type}
                />
                <Button bsStyle="primary" onClick={this.addToFavorite} style={{float: "right"}}>
                    {"Add to favorite"}
                </Button>
                <ReactHighstock config={this.getHighstockConfig()} />
            </div>
        );
    }
});

module.exports = MonitoringChart;