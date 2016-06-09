import R from "ramda";
import React, {PropTypes} from "react";
import ReactHighstock from "react-highcharts/bundle/ReactHighstock"; // Highstock is bundled

import {defaultTheme} from "lib/theme";

var MonitoringChart = React.createClass({
    propTypes: {
        chartState: PropTypes.object.isRequired,
        saveConfig: PropTypes.func.isRequired,
        series: PropTypes.array.isRequired,
        style: PropTypes.object,
        yAxis: PropTypes.array.isRequired
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
            config: this.buildConfig(props)
        };
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    normalizeSeries: function (props, yAxis) {
        var series = [];
        props.series.forEach (item => {
            let data = [];
            let nexDate = item.pointStart - item.pointInterval;
            item.data.forEach (dataVal => {
                data.push([nexDate + item.pointInterval, dataVal]);
                nexDate += item.pointInterval;
            });
            series.push({
                name: item.name,
                data: data,
                yAxis: R.findIndex(R.propEq("key", item.unitOfMeasurement))(yAxis)
            });
        });
        return {
            series: series
        };
    },
    getYAxis: function (props) {
        let yAxis = [];
        props.yAxis.forEach (item => {
            let {min, max} = props.chartState.yAxis[item];
            let config = {
                key: item,
                labels: {
                    format: "{value} " + item
                },
                opposite: yAxis.length > 0
            };
            if (min) {
                config.min = min;
            }
            if (max) {
                config.max = max;
            }
            yAxis.push(config);
        });
        return yAxis;
    },
    getCommonConfig: function (props, yAxis) {
        const theme = this.getTheme();
        return {
            chart: {
                ...this.getCommonChartConfig(),
                type: props.chartState.type
            },
            credits: {
                enabled: false
            },
            legend: {
                enabled: true,
                itemStyle: {
                    color: theme.colors.mainFontColor
                },
                itemHoverStyle: {
                    color: theme.colors.mainFontColor
                }
            },
            rangeSelector: {
                buttonTheme: { // styles for the buttons
                    fill: "none",
                    r: 12,
                    stroke: theme.colors.mainFontColor,
                    "stroke-width": 1,
                    width: 50,
                    style: {
                        color: theme.colors.mainFontColor
                    },
                    states: {
                        hover: {
                            fill: theme.colors.buttonPrimary,
                            stroke: theme.colors.buttonPrimary,
                            style: {
                                color: theme.colors.white
                            }
                        },
                        select: {
                            stroke: theme.colors.buttonPrimary,
                            fill: theme.colors.buttonPrimary,
                            style: {
                                color: theme.colors.white
                            }
                        }
                    }
                },
                inputBoxBorderColor:  theme.colors.mainFontColor,
                inputStyle: {
                    color: theme.colors.buttonPrimary,
                    fontWeight: "600"
                },
                labelStyle: {
                    color: theme.colors.mainFontColor,
                    fontWeight: "600"
                },
                buttons: [
                    {type: "day", count: 1, text: "1 gg"},
                    {type: "week", count: 1, text: "1 sett"},
                    {type: "month", count: 1, text: "1 mese"},
                    {type: "year", count: 1, text: "1 anno"},
                    {type: "ytd", text: "YTD"},
                    {type: "all", text: "Tutto"}
                ],
                selected: 1
            },
            tooltip: {
                shared: true
            },
            yAxis: yAxis
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
    getStackedConfig: function (props) {
        return {
            chart: {
                ...this.getCommonChartConfig(),
                type: "column"
            },
            yAxis: {
                ...props.chartState.yAxis,
                stackLabels: {
                    enabled: true,
                    style: {
                        fontWeight: "600"
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
    getSpecificTypeConfig: function (props) {
        switch (props.chartState.type) {
            case "column":
                return this.getColumnConfig();
            case "stacked":
                return this.getStackedConfig(props);
            case "percent":
                return this.getPercentConfig();
            case "line":
            default:
                return this.getBasicLineConfig();
        }
    },
    buildConfig: function (props) {
        if (props.chartState.config) {
            return props.chartState.config;
        } else {
            let yAxis = this.getYAxis(props);
            return {
                ...this.getCommonConfig(props, yAxis),
                ...this.getSpecificTypeConfig(props),
                ...this.normalizeSeries(props, yAxis)
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
