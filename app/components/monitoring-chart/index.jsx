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
            config: this.buildConfig(props.chartState.config)
        };
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    normalizeSeries: function () {
        var series = [];
        this.props.series.forEach (item => {
            let data = [];
            let nexDate = item.pointStart - item.pointInterval;
            item.data.forEach (dataVal => {
                data.push([nexDate + item.pointInterval, dataVal]);
                nexDate += item.pointInterval;
            });
            series.push({
                name: item.name,
                data: data
            });
        });
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
                enabled: true,
                itemStyle: {
                    color: "#8D8D8E"
                },
                itemHoverStyle: {
                    color: "#8D8D8E"
                }
            },
            rangeSelector: {
                buttonTheme: { // styles for the buttons
                    fill: theme.colors.buttonPrimary,
                    r: 8,
                    style: {
                        background: theme.colors.backgroundChartSelectedButton,
                        border: "1px solid "+ theme.colors.borderChartSelectedButton,
                        color: theme.colors.textSelectButton,
                        fontWeight: "300",
                        height: "30px",
                        width: "85px",
                        padding: "5px 10px"
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
    getLabels: function () {
        // TODO
        return ["a"];
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
    buildConfig: function (configProp) {
        if (configProp) {
            return configProp;
        } else {
            return {
                ...this.getCommonConfig(),
                ...this.getSpecificTypeConfig(),
                ...this.normalizeSeries()
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
