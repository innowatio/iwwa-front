import React, {PropTypes} from "react";
import IPropTypes from "react-immutable-proptypes";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

import {
    addMoreData,
    addToFavorite,
    changeYAxisValues,
    resetYAxisValues,
    saveChartConfig,
    selectChartType,
    selectPeriod,
    selectTimeInterval,
    toggleComparisonChart
} from "actions/monitoring-chart";

import {extractSensorsFromFormula, getAggregationFunction, getAllSensors, getSensorLabel, reduceFormula} from "lib/sensors-utils";
import {defaultTheme} from "lib/theme";
import moment from "lib/moment";
import readingsDailyAggregatesToHighchartsData from "lib/readings-daily-aggregates-to-highcharts-data";

import {MonitoringChart, MonitoringChartToolbar, SectionToolbar} from "components";

var MonitoringChartView = React.createClass({
    propTypes: {
        addMoreData: PropTypes.func.isRequired,
        addToFavorite: PropTypes.func.isRequired,
        asteroid: PropTypes.object,
        changeYAxisValues: PropTypes.func.isRequired,
        collections: IPropTypes.map.isRequired,
        monitoringChart: PropTypes.object.isRequired,
        resetYAxisValues: PropTypes.func.isRequired,
        saveChartConfig: PropTypes.func.isRequired,
        selectChartType: PropTypes.func.isRequired,
        selectPeriod: PropTypes.func.isRequired,
        selectTimeInterval: PropTypes.func.isRequired,
        toggleComparisonChart: PropTypes.func.isRequired
    },
    contextTypes: {
        theme: PropTypes.object
    },
    componentDidMount: function () {
        this.props.asteroid.subscribe("sensors");
        this.subscribeToSensorsData(this.props);
    },
    componentWillReceiveProps: function (props) {
        this.subscribeToSensorsData(props);
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    getAllSensors: function () {
        return getAllSensors(this.props.collections.get("sensors"));
    },
    getSensorObj: function (sensor, allSensor) {
        return typeof sensor === "string" ? allSensor.get(sensor) : sensor;
    },
    getStartDate: function (props) {
        return moment().subtract(props.monitoringChart.dataMonthsSpan.backward, "months").startOf("month");
    },
    getEndDate: function (props) {
        return moment().add(props.monitoringChart.dataMonthsSpan.forward, "months").endOf("month");
    },
    getUnitOfMeasurement: function (sensor) {
        return sensor.get("unitOfMeasurement") ? sensor.get("unitOfMeasurement") : "indefinito";
    },
    subscribeToSensorsData: function (props) {
        const sensors = props.monitoringChart.sensorsToDraw;
        let allSensors = this.getAllSensors();
        sensors[0] && sensors.forEach((sensor) => {
            let sensorObj = this.getSensorObj(sensor, allSensors);
            let sensors = extractSensorsFromFormula(sensorObj, allSensors);
            sensors.forEach((sensor) => {
                props.asteroid.subscribe(
                    "dailyMeasuresBySensor",
                    sensor.get("_id"),
                    this.getStartDate(props).format("YYYY-MM-DD"),
                    this.getEndDate(props).format("YYYY-MM-DD"),
                    "reading",
                    sensor.get("measurementType")
                );
            });
        });
    },
    getChartDates: function (props) {
        return {
            start: this.getStartDate(props).valueOf(),
            end: this.getEndDate(props).valueOf()
        };
    },
    getChartSeries: function (props) {
        const allSensors = this.getAllSensors();
        const monitoringCharts = props.monitoringChart.sensorsToDraw.map(sensor => {
            const sensorObj = this.getSensorObj(sensor, allSensors);
            return {
                date: this.getChartDates(props),
                formula: reduceFormula(sensorObj, allSensors),
                measurementType: {key: sensorObj.get("measurementType")},
                name: getSensorLabel(sensorObj),
                sensorId: sensorObj.get("_id"),
                source: {key: "reading"},
                unitOfMeasurement: this.getUnitOfMeasurement(sensorObj),
                aggregationType: getAggregationFunction(sensorObj.get("aggregationType"))
            };
        });
        const readingsDailyAggregates = props.collections.get("readings-daily-aggregates");
        if (readingsDailyAggregates) {
            return readingsDailyAggregatesToHighchartsData(readingsDailyAggregates, monitoringCharts, allSensors);
        }
    },
    haveNullSeries: function (series) {
        return series.some(it => {
            let isNull = true;
            for (let i = 0; i < it.data.length && isNull; i++) {
                const val = it.data[i][1];
                isNull = val !== 0 && !val;
            }
            return isNull;
        });
    },
    getYAxis: function (props) {
        let yAxis = [];
        const allSensors = this.getAllSensors();
        props.monitoringChart.sensorsToDraw.forEach(sensor => {
            const sensorObj = this.getSensorObj(sensor, allSensors);
            const unit = this.getUnitOfMeasurement(sensorObj);
            if (yAxis.indexOf(unit) < 0) {
                yAxis.push(unit);
            }
        });
        return yAxis;
    },
    renderChart: function () {
        let series = this.getChartSeries(this.props);
        if (series && !this.haveNullSeries(series)) {
            return (
                <div style={{width: "100%", height: "100%", overflow: "scroll"}}>
                    <MonitoringChart
                        addMoreData={this.props.addMoreData}
                        chartDates={this.getChartDates(this.props)}
                        chartState={this.props.monitoringChart}
                        ref="monitoringChart"
                        saveConfig={this.props.saveChartConfig}
                        selectPeriod={this.props.selectPeriod}
                        series={series}
                        yAxis={this.getYAxis(this.props)}
                    />
                </div>
            );
        }
    },
    render: function () {
        const theme = this.getTheme();
        return (
            <div>
                <SectionToolbar backLink={true} title={"Torna all'elenco sensori"} />
                <div style={{overflow: "hidden", width: "75%", float: "left", height: "calc(100vh - 120px)"}}>
                    {this.renderChart()}
                </div>
                <div style={{
                    width: "25%",
                    backgroundColor: theme.colors.secondary,
                    borderTop: "2px solid " + theme.colors.black,
                    float: "right",
                    height: "calc(100vh - 120px)"
                }}>
                    <MonitoringChartToolbar
                        addToFavorite={this.props.addToFavorite}
                        asteroid={this.props.asteroid}
                        changeYAxisValues={this.props.changeYAxisValues}
                        getYAxis={this.getYAxis}
                        monitoringChart={this.props.monitoringChart}
                        monitoringChartRef={this.refs.monitoringChart}
                        resetYAxisValues={this.props.resetYAxisValues}
                        selectChartType={this.props.selectChartType}
                        selectTimeInterval={this.props.selectTimeInterval}
                        toggleComparisonChart={this.props.toggleComparisonChart}
                    />
                </div>
            </div>
        );
    }
});

const mapStateToProps = (state) => {
    return {
        collections: state.collections,
        monitoringChart: state.monitoringChart
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addMoreData: bindActionCreators(addMoreData, dispatch),
        addToFavorite: bindActionCreators(addToFavorite, dispatch),
        changeYAxisValues: bindActionCreators(changeYAxisValues, dispatch),
        resetYAxisValues: bindActionCreators(resetYAxisValues, dispatch),
        saveChartConfig: bindActionCreators(saveChartConfig, dispatch),
        selectChartType: bindActionCreators(selectChartType, dispatch),
        selectPeriod: bindActionCreators(selectPeriod, dispatch),
        selectTimeInterval: bindActionCreators(selectTimeInterval, dispatch),
        toggleComparisonChart: bindActionCreators(toggleComparisonChart, dispatch)
    };
};

module.exports = connect(mapStateToProps, mapDispatchToProps)(MonitoringChartView);
