import R from "ramda";
import React, {PropTypes} from "react";
import ReactHighstock from "react-highcharts/bundle/ReactHighstock"; // Highstock is bundled
import ExportCSV from "highcharts-export-csv";
ExportCSV(ReactHighstock.Highcharts);


import {defaultTheme} from "lib/theme";
import {Button, Icon} from "components";

const chartColors = [
    "#D500F9",
    "#FBC02E",
    "#6EB1E2",
    "#B388FF",
    "#81C9C3",
    "#ED6D47",
    "#CCD73F",
    "#15B0C4",
    "#4E64AC",
    "#E94581"
];

const charts = [
    {
        key: "DEFAULT"
    },
    {
        key: "WEEK",
        timeShifter: -(1000 * 60 * 60 * 24 * 7)
    },
    {
        key: "MONTH",
        timeShifter: -(1000 * 60 * 60 * 24 * 30)
    },
    {
        key: "YEAR",
        timeShifter: -(1000 * 60 * 60 * 24 * 365)
    }
];

var MonitoringChart = React.createClass({
    propTypes: {
        addMoreData: PropTypes.func.isRequired,
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
        ReactHighstock.Highcharts.Pointer.prototype.reset = function () {
            return undefined;
        };
        ReactHighstock.Highcharts.Point.prototype.highlight = function (event, points) {
            this.onMouseOver(); // Show the hover marker
            this.series.chart.tooltip.refresh(points); // Show the tooltip
            this.series.chart.xAxis[0].drawCrosshair(event, this); // Show the crosshair
        };
        ReactHighstock.Highcharts.Chart.prototype.resetHighlight = function () {
            if (this.hoverPoint) {
                this.hoverPoint.setState(null);
            }
            this.tooltip.hide();
            this.xAxis[0].hideCrosshair();
        };
        ReactHighstock.Highcharts.setOptions({
            global: {
                timezoneOffset: new Date().getTimezoneOffset(),
                useUTC: false
            }
        });
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
        props.series.forEach ((item, index) => {
            let yAxisIndex = R.findIndex(R.propEq("key", item.unitOfMeasurement))(yAxis);
            let config = {
                data: item.data,
                name: item.name,
                yAxis: yAxisIndex
            };
            if (chartColors.length > index) {
                config.color = chartColors[index];
            }
            series.push(config);
        });
        return {
            series: series
        };
    },
    getYAxis: function (props) {
        let yAxis = [];
        props.yAxis.forEach ((item) => {
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
                ...this.getCommonChartConfig(props),
                type: props.chartState.type,
                zoomType: "x"
            },
            credits: {
                enabled: false
            },
            exporting: {
                csv: {
                    dateFormat: "%d/%m/%Y %H:%M"
                }
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
            navigator: {
                series: {
                    includeInCSVExport: false
                }
            },
            plotOptions: {
                series: {
                    events: {
                        legendItemClick: this.synchronizeSeries
                    }
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
                pointFormat: "<span style=\"color:{point.color}\">\u25CF</span> {series.name}: <b>{point.y:.2f}</b><br/>",
                shared: true
            },
            xAxis: {
                max: props.chartState.xAxis.max,
                min: props.chartState.xAxis.min,
                events: {
                    afterSetExtremes: this.synchronizeXAxis
                }
            },
            yAxis: yAxis
        };
    },
    getCommonChartConfig: function (props) {
        const theme = this.getTheme();
        return {
            backgroundColor: theme.colors.background,
            height: this.getChartHeight(props)
        };
    },
    getChartHeight: function (props) {
        let {year, month, week} = props.chartState.comparisonCharts;
        let chartCount = year + month + week;
        return 600 - (chartCount * 100);
    },
    getBasicLineConfig: function () {
        return {};
    },
    getColumnConfig: function () {
        return {};
    },
    getStackedConfig: function (props) {
        return {
            chart: {
                ...this.getCommonChartConfig(props),
                type: "column"
            },
            yAxis: {
                ...props.chartState.yAxis
            },
            plotOptions: {
                column: {
                    stacking: "normal"
                }
            }
        };
    },
    getPercentConfig: function (props) {
        return {
            chart: {
                ...this.getCommonChartConfig(props),
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
                return this.getColumnConfig(props);
            case "stacked":
                return this.getStackedConfig(props);
            case "percent":
                return this.getPercentConfig(props);
            case "line":
            default:
                return this.getBasicLineConfig(props);
        }
    },
    buildConfig: function (props) {
        if (props.chartState.config) {
            return props.chartState.config;
        } else {
            const yAxis = this.getYAxis(props);
            const config = {
                ...this.getCommonConfig(props, yAxis),
                ...this.getSpecificTypeConfig(props),
                ...this.normalizeSeries(props, yAxis)
            };
            // this line cause:
            // warning.js:44 Warning: setState(...): Cannot update during an existing state transition
            // (such as within `render` or another component's constructor). Render methods should be a pure function of props and state;
            // constructor side-effects are an anti-pattern, but can be moved to `componentWillMount`.
            props.saveConfig(config, props.chartState.type == "percent");
            return config;
        }
    },
    getComparisonChartConfig: function (period) {
        let chartTitle;
        const theme = this.getTheme();
        switch (period) {
            case "year": {
                chartTitle = "Anno precedente";
                break;
            }
            case "month": {
                chartTitle = "Mese precedente";
                break;
            }
            case "week": {
                chartTitle = "Settimana precedente";
                break;
            }
        }
        return {
            ...this.state.config,
            chart: {
                ...this.state.config.chart,
                zoomType: null
            },
            legend: {
                enabled: false
            },
            navigator: {
                enabled: false
            },
            plotOptions: {
                ...this.state.config.plotOptions,
                series: null
            },
            rangeSelector: {
                enabled: false
            },
            scrollbar: {
                enabled: false
            },
            title: {
                style: {
                    color: theme.colors.white
                },
                text: chartTitle
            },
            xAxis: null
        };
    },
    synchronizeSeries: function (event) {
        this.doForEveryChart((hsChart, chart) => {
            if (chart.key !== "DEFAULT") {
                hsChart.series.forEach(series => {
                    if (series.name === event.target.name) {
                        !event.target.visible ? series.show() : series.hide();
                    }
                });
            }
            hsChart.resetHighlight();
        });
    },
    synchronizeXAxis: function (xAxis) {
        this.doForEveryChart((hsChart, chart) => {
            if (chart.key !== "DEFAULT") {
                hsChart.xAxis[0].setExtremes(xAxis.min + chart.timeShifter, xAxis.max + chart.timeShifter);
            }
        });
    },
    highlightCharts: function (e) {
        this.doForEveryChart((hsChart, chart) => {
            const event = hsChart.pointer.normalize(e.nativeEvent);
            let points = [];
            hsChart.series.forEach((s, index) => {
                if (s.visible) {
                    const point = s.searchPoint(event, true);
                    if (point &&
                        (chart.key !== "DEFAULT" ||
                        (chart.key === "DEFAULT" && index < hsChart.series.length - 1))) { // need to skip the navigator
                        points.push(point);
                    }
                }
            });
            points.forEach(point => {
                point.highlight(e.nativeEvent, points);
            });
        });
    },
    doForEveryChart: function (action) {
        charts.forEach(chart => {
            const chartRef = this.refs[chart.key];
            if (chartRef) {
                const hsChart = chartRef.getChart();
                action(hsChart, chart);
            }
        });
    },
    renderComparisonCharts: function () {
        let components = [];
        let {year, month, week} = this.props.chartState.comparisonCharts;
        components.push(week ? <ReactHighstock config={this.getComparisonChartConfig("week")} key="week" ref={charts[1].key} /> : null);
        components.push(month ? <ReactHighstock config={this.getComparisonChartConfig("month")} key="month" ref={charts[2].key} /> : null);
        components.push(year ? <ReactHighstock config={this.getComparisonChartConfig("year")} key="year" ref={charts[3].key} /> : null);
        return components;
    },
    renderMoreDataButton: function (theme, backward) {
        let buttonStyle = {
            borderRadius: backward ? "0 20px 20px 0" : "20px 0 0 20px",
            padding: "0px 3px",
            backgroundColor: theme.colors.primary,
            border: "0px",
            height: "35px",
            position: "absolute",
            top: "35%",
            zIndex: 1
        };
        buttonStyle[backward ? "left" : "right"] = "0px";
        return (
            <Button
                onClick={() => this.props.addMoreData(backward)}
                style={buttonStyle}
            >
                <Icon
                    color={theme.colors.iconArrowSwitch}
                    icon={"add"}
                    size={"24px"}
                    style={{lineHeight: "20px", verticalAlign: "middle"}}
                />
            </Button>
        );
    },
    render: function () {
        const theme = this.getTheme();
        return (
            <div>
                <div
                    style={{position: "relative", padding: "0px 3%", margin: "40px 0px", ...this.props.style}}
                    onMouseMove={this.highlightCharts}
                >
                    <div>
                        {this.renderMoreDataButton(theme, true)}
                        {this.renderMoreDataButton(theme, false)}
                    </div>
                    <ReactHighstock config={this.state.config} ref={charts[0].key} />
                </div>
                <div
                    style={{padding: "0px 3%", margin: "40px 0px", ...this.props.style}}
                    onMouseMove={this.highlightCharts}
                >
                    {this.renderComparisonCharts()}
                </div>
            </div>
        );
    }
});

module.exports = MonitoringChart;
