import React, {PropTypes} from "react";
import components from "components";
import moment from "moment";

import {defaultTheme} from "lib/theme";

var MonitoringChart = React.createClass({
    propTypes: {
        chartState: PropTypes.object.isRequired,
        dateRanges: PropTypes.array.isRequired,
        resetZoom: PropTypes.func.isRequired,
        saveConfig: PropTypes.func.isRequired,
        series: PropTypes.array.isRequired,
        setZoomExtremes: PropTypes.func.isRequired,
        style: PropTypes.object
    },
    contextTypes: {
        theme: PropTypes.object
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
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
            }
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
    getConfig: function () {
        return {
            legend: {
                enabled: true,
                itemStyle: {
                    color: "#8D8D8E"
                },
                itemHoverStyle: {
                    color: "#8D8D8E"
                }
            }
        };
    },
    getDateFilter: function () {
        // TODO always load all because filters doesnt work properly atm 
        const rangeKey = "all";// this.props.dateRanges[0].key;
        const standardDatesSelectors = ["day", "week", "month", "year"];
        console.log("getDateFilter");
        if (standardDatesSelectors.indexOf(rangeKey) >= 0) {
            return {
                start: moment.utc().startOf(rangeKey).format("YYYY-MM-DD"),
                end: moment.utc().endOf(rangeKey).format("YYYY-MM-DD")
            };
        } else {
            return {
                start: moment.utc().subtract(1, "years").startOf("day").format("YYYY-MM-DD"),
                // end of month to avoid not charging all the weekends (anyway this should happen only in dev)
                end: moment.utc().endOf("month").format("YYYY-MM-DD")
            };
        }
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
    render: function () {
        return (
            <div style={{marginBottom: "60px", ...this.props.style}}>
                <components.HighCharts
                    config={this.getConfig()}
                    coordinates={this.props.series}
                    dateFilter={this.getDateFilter()}
                    colors={["red", "green", "cyan", "yellow", "grey", "blue"]}
                    resetZoom={this.props.resetZoom}
                    setZoomExtremes={this.props.setZoomExtremes}
                    yLabel={this.getLabels()}
                />
            </div>
        );
    }
});

module.exports = MonitoringChart;
