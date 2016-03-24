import React, {PropTypes} from "react";
import ReactHighstock from "react-highcharts/bundle/ReactHighstock"; // Highstock is bundled

import {defaultTheme} from "lib/theme";

//const chartTypes = [
//    {label: "Linea", id: "spline"},
//    {label: "Istogramma", id: "column"},
//    {label: "In pila", id: "stacked"},
//    {label: "In pila percentuale", id: "percent"}
//];

let config;

var MonitoringChart = React.createClass({
    propTypes: {
        addToFavorite: PropTypes.func.isRequired,
        chartState: PropTypes.object.isRequired,
        onChangeYAxisValues: PropTypes.func.isRequired,
        selectChartType: PropTypes.func.isRequired,
        series: PropTypes.array.isRequired,
        style: PropTypes.object
    },
    contextTypes: {
        theme: PropTypes.object
    },
    getInitialState: function () {
        return this.initializeState(this.props);
    },
    componentWillReceiveProps: function (props) {
        this.setState(this.initializeState(props));
    },
    initializeState: function (props) {
        return {
            yAxisMax: props.chartState.yAxis.max,
            yAxisMin: props.chartState.yAxis.min
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
    getHighstockConfig: function () {
        if (this.props.chartState.config) {
            config = this.props.chartState.config;
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
        //let type = chartTypes.find((item) => {
        //    return item.id === this.props.chartState.type;
        //});
        return (
            <div style={{marginBottom: "60px", ...this.props.style}}>
                <ReactHighstock config={this.getHighstockConfig()} />
            </div>
        );
                //<ObjectSelect
                //    options={chartTypes}
                //    onBlur={() => {}}
                //    onChange={this.props.selectChartType}
                //    value={type}
                ///>
                //<Button bsStyle="primary" onClick={this.addToFavorite} style={{float: "right"}}>
                //    {"Add to favorite"}
                //</Button>
                //
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