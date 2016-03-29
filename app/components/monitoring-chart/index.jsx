import React, {PropTypes} from "react";
import ReactHighstock from "react-highcharts/bundle/ReactHighstock"; // Highstock is bundled

import {defaultTheme} from "lib/theme";

var MonitoringChart = React.createClass({
    propTypes: {
        chartState: PropTypes.object.isRequired,
        saveConfig: PropTypes.func.isRequired,
        series: PropTypes.array.isRequired,
        style: PropTypes.object
    },
    contextTypes: {
        theme: PropTypes.object
    },
    getInitialState: function () {
        return this.getStateFromProps(this.props);
    },
    componentDidMount: function () {
        this.props.saveConfig(this.state.config);
    },
    componentWillReceiveProps: function (props) {
        this.setState(this.getStateFromProps(props));
    },
    getStateFromProps: function (props) {
        return {
            config: this.getHighstockConfig(props.chartState.config)
        };
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
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
                name: item,
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
        const theme = this.getTheme();
        return {
            chart: {
                ...this.getCommonChartConfig(),
                type: this.props.chartState.type
            },
            credits: {
                enabled: false
            },
            legend: {
                enabled: true
            },
            rangeSelector: {
                buttonTheme: { // styles for the buttons
                    fill: "blue",
                    r: 8,
                    style: {
                        color: "white",
                        fontWeight: "bold"
                    },
                    states: {
                        hover: {},
                        select: {
                            fill: theme.colors.buttonPrimary,
                            style: {
                                color: "white"
                            }
                        }
                    }
                },
                buttons: [
                    {type: "day", count: 1, text: "1 gg"},
                    {type: "week", count: 1, text: "1 sett"},
                    {type: "month", count: 1, text: "1 mese"},
                    {type: "year", count: 1, text: "1 anno"},
                    {type: "ytd", text: "YTD"},
                    {type: "all", text: "Tutto"}
                ],
                selected: 2
            },
            tooltip: {
                shared: true
            },
            yAxis: this.props.chartState.yAxis
        };
    },
    getCommonChartConfig: function () {
        const theme = this.getTheme();
        return {
            backgroundColor: theme.colors.background,
            height: 600
        };
    },
    getBasicLineConfig: function () {
        return {};
    },
    getColumnConfig: function () {
        return {};
    },
    getStackedConfig: function () {
        return {
            chart: {
                ...this.getCommonChartConfig(),
                type: "column"
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
                ...this.getCommonChartConfig(),
                type: "column"
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
            case "line":
            default:
                return this.getBasicLineConfig();
        }
    },
    getHighstockConfig: function (configProp) {
        if (configProp) {
            return configProp;
        } else {
            return {
                ...this.getCommonConfig(),
                ...this.getSpecificTypeConfig(),
                ...this.getHighstockCoordinate()
            };
        }
    },
    render: function () {
        return (
            <div style={{marginBottom: "60px", ...this.props.style}}>
                <ReactHighstock config={this.state.config} />
            </div>
        );
    }
});

module.exports = MonitoringChart;