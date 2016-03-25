import React, {PropTypes} from "react";
import ReactHighstock from "react-highcharts/bundle/ReactHighstock"; // Highstock is bundled

import {defaultTheme} from "lib/theme";

var MonitoringChart = React.createClass({
    propTypes: {
        chartState: PropTypes.object.isRequired,
        onChangeYAxisValues: PropTypes.func.isRequired,
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
            yAxisMax: props.chartState.yAxis.max,
            yAxisMin: props.chartState.yAxis.min,
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
                height: 600,
                type: this.props.chartState.type,
                style: {
                    backgroundColor: theme.colors.background
                }
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
            tooltip: {
                shared: true
            },
            yAxis: this.props.chartState.yAxis
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
            case "line":
            default:
                return this.getBasicLineConfig();
        }
    },
    getHighstockConfig: function (configProp) {
        if (configProp) {
            return configProp;
        } else {
            console.log("building chart of type: " + this.props.chartState.type);
            return {
                ...this.getCommonConfig(),
                ...this.getSpecificTypeConfig(),
                ...this.getHighstockCoordinate()
            };
        }
    },
    handleAxisChange: function () {
        this.setState({
            yAxisMax: this.refs.yAxisMax.getValue(),
            yAxisMin: this.refs.yAxisMin.getValue()
        });
    },
    getYAxisValidationState: function () {
        console.log(this.state);
        let {yAxisMin, yAxisMax} = this.state;
        if (isNaN(yAxisMin) || isNaN(yAxisMax)) return "error";
        if (parseInt(yAxisMin) > parseInt(yAxisMax)) return "warning";
        return "success";
    },
    changeYAxisValues: function () {
        this.props.onChangeYAxisValues({
            max: this.state.yAxisMax,
            min: this.state.yAxisMin
        });
    },
    render: function () {
        return (
            <div style={{marginBottom: "60px", ...this.props.style}}>
                <ReactHighstock config={this.state.config} />
            </div>
        );
                //<div>
                //    <Input
                //        type="text"
                //        value={this.state.yAxisMin}
                //        label="yAxis min"
                //        bsStyle={this.getYAxisValidationState()}
                //        hasFeedback={true}
                //        ref="yAxisMin"
                //        onChange={this.handleAxisChange}
                //    />
                //    <Input
                //        type="text"
                //        value={this.state.yAxisMax}
                //        label="yAxis max"
                //        bsStyle={this.getYAxisValidationState()}
                //        hasFeedback={true}
                //        ref="yAxisMax"
                //        onChange={this.handleAxisChange}
                //    />
                //    <Button onClick={this.changeYAxisValues}>
                //        {"Change axis value"}
                //    </Button>
                //</div>
    }
});

module.exports = MonitoringChart;