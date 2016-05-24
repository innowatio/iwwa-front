import React, {PropTypes} from "react";
import {Col, ControlLabel, FormControl} from "react-bootstrap";
import IPropTypes from "react-immutable-proptypes";
import {connect} from "react-redux";
import {Link} from "react-router";
import {bindActionCreators} from "redux";
import moment from "moment";
import Radium from "radium";

import {
    addToFavorite,
    changeYAxisValues,
    resetYAxisValues,
    saveChartConfig,
    selectChartType,
    selectFavoriteChart
} from "actions/monitoring-chart";

import {getUnitOfMeasurement} from "lib/sensors-decorators";
import {extractSensorsFromFormula, getAllSensors, getSensorLabel} from "lib/sensors-utils";
import {styles} from "lib/styles_restyling";
import {defaultTheme} from "lib/theme";
import readingsDailyAggregatesToHighchartsData from "lib/readings-daily-aggregates-to-highcharts-data";

import {Button, Icon, MonitoringChart, SectionToolbar} from "components";

const buttonStyle = ({colors}) => ({
    backgroundColor: colors.primary,
    border: "0px none",
    borderRadius: "100%",
    height: "50px",
    width: "50px",
    padding: "0px",
    textAlign: "center",
    margin: "0px 5px"
});

const inputStyleRules = ({colors}) => ({
    "": {
        padding: "0px 5px",
        margin: "0px 0px 20px 0px"
    },
    "label.control-label": {
        display: "block",
        color: colors.white,
        fontWeight: "300",
        padding: "0px",
        margin: "0px"
    },
    "label.control-label span": {
        display: "block"
    },
    "input": {
        borderBottom: "1px solid",
        borderColor: colors.white + "!important"
    },
    "span": {
        display: "none"
    }
});

var MonitoringChartView = React.createClass({
    propTypes: {
        addToFavorite: PropTypes.func.isRequired,
        asteroid: PropTypes.object,
        changeYAxisValues: PropTypes.func.isRequired,
        collections: IPropTypes.map.isRequired,
        monitoringChart: PropTypes.object.isRequired,
        resetYAxisValues: PropTypes.func.isRequired,
        saveChartConfig: PropTypes.func.isRequired,
        selectChartType: PropTypes.func.isRequired,
        selectFavoriteChart: PropTypes.func.isRequired,
        title: React.PropTypes.string
    },
    contextTypes: {
        theme: PropTypes.object
    },
    getInitialState: function () {
        return this.getStateFromProps(this.props);
    },
    componentDidMount: function () {
        this.props.asteroid.subscribe("sensors");
        this.subscribeToSensorsData(this.props);
    },
    componentWillReceiveProps: function (props) {
        this.setState(this.getStateFromProps(props));
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    getAllSensors: function () {
        return getAllSensors(this.props.collections.get("sensors"));
    },
    getFilters: function () {
        return [
            {key: "day", label: "1 gg"},
            {key: "week", label: "1 sett"},
            {key: "month", label: "1 mese"},
            {key: "year", label: "1 anno"},
            {key: "ytd", label: "YTD"},
            {key: "all", label: "Tutto"}
        ];
    },
    getStateFromProps: function (props) {
        let state = {
            yAxis: props.monitoringChart.yAxis
        };
        let yAxis = this.getYAxis(props);
        yAxis.forEach(y => {
            if (!state.yAxis[y]) {
                state.yAxis[y] = {
                    min: "",
                    max: ""
                };
            }
        });
        return state;
    },
    getSensorObj: function (sensor, allSensor) {
        return typeof sensor === "string" ? allSensor.get(sensor) : sensor;
    },
    subscribeToSensorsData: function (props) {
        const sensors = props.monitoringChart.sensorsToDraw;
        let allSensors = this.getAllSensors();
        sensors[0] && sensors.forEach((sensor) => {
            let sensorObj = this.getSensorObj(sensor, allSensors);
            let sensorFormula = sensorObj.get("formula");
            let sensors = sensorFormula ? extractSensorsFromFormula(sensorFormula, allSensors) : [sensorObj];
            sensors.forEach((sensor) => {
                // last year for sensors
                props.asteroid.subscribe(
                    "dailyMeasuresBySensor",
                    sensor.get("_id"),
                    moment.utc().subtract(1, "years").startOf("month").format("YYYY-MM-DD"),
                    moment.utc().endOf("month").format("YYYY-MM-DD"),
                    "reading",
                    sensor.get("measurementType")
                );
            });
        });
    },
    getChartSeries: function (props) {
        let allSensors = this.getAllSensors();
        const monitoringCharts = props.monitoringChart.sensorsToDraw.map(sensor => {
            let sensorObj = this.getSensorObj(sensor, allSensors);
            let unit = sensorObj.get("unitOfMeasurement") ? sensorObj.get("unitOfMeasurement") : getUnitOfMeasurement(sensorObj.get("measurementType"));
            return {
                date: {
                    start: moment.utc().startOf("year").valueOf(),
                    end: moment.utc().endOf("month").valueOf()
                },
                formula: sensorObj.get("formula"),
                measurementType: {key: sensorObj.get("measurementType")},
                name: getSensorLabel(sensorObj),
                sensorId: sensorObj.get("_id"),
                source: {key: "reading"},
                unitOfMeasurement: unit
            };
        });
        const readingsDailyAggregates = props.collections.get("readings-daily-aggregates");
        if (readingsDailyAggregates) {
            return readingsDailyAggregatesToHighchartsData(readingsDailyAggregates, monitoringCharts);
        }
    },
    getYAxisValidationState: function () {
        let yAxis = this.getYAxis(this.props);
        let success = true;
        yAxis.forEach((y) => {
            let {min, max} = this.state.yAxis[y];
            success = success && (parseInt(min) < parseInt(max));
        });
        return success ? "success" : "error";
    },
    changeYAxisValues: function () {
        this.props.changeYAxisValues(this.state.yAxis);
    },
    haveNullSeries: function (series) {
        return series.some((it) => {
            let isNull = true;
            for (let i = 0; i < it.data.length && isNull; i++) {
                isNull = !it.data[i];
            }
            return isNull;
        });
    },
    getYAxis: function (props) {
        let yAxis = [];
        let series = this.getChartSeries(props);
        if (series && !this.haveNullSeries(series)) {
            series.forEach (item => {
                if (yAxis.indexOf(item.unitOfMeasurement) < 0) {
                    yAxis.push(item.unitOfMeasurement);
                }
            });
        }
        return yAxis;
    },
    renderChart: function () {
        let series = this.getChartSeries(this.props);
        if (series && !this.haveNullSeries(series)) {
            return (
                <MonitoringChart
                    chartState={this.props.monitoringChart}
                    ref="monitoringChart"
                    saveConfig={this.props.saveChartConfig}
                    series={series}
                    yAxis={this.getYAxis(this.props)}
                />
            );
        }
    },
    renderYAxisValuesChange: function (theme) {
        return (
            <div style={{
                padding: "20px",
                borderBottom: "solid 1px",
                borderColor: theme.colors.white
            }}
            >
                <label style={{
                    color: theme.colors.white,
                    display: "inherit",
                    fontSize: "16px",
                    marginBottom: "10px",
                    textAlign: "center"
                }}
                >
                    {"CAMBIA VALORI ASSI Y"}
                </label>
                {this.renderYAxisInputs(theme)}
                <div style={{textAlign: "center"}}>
                    <Button
                        onClick={this.changeYAxisValues}
                        style={{
                            ...styles(theme).buttonSelectChart,
                            width: "120px",
                            height: "40px",
                            lineHeight: "40px",
                            padding: "0px",
                            margin: "0px 0px 0px 30px",
                            fontSize: "20px",
                            border: "0px",
                            backgroundColor: this.getTheme().colors.buttonPrimary
                        }}
                    >
                        {"OK"}
                    </Button>
                    <Button
                        bsStyle={"link"}
                        onClick={this.props.resetYAxisValues}
                    >
                        <Icon
                            color={theme.colors.iconArrow}
                            icon={"reset"}
                            size={"35px"}
                            style={{
                                float: "right",
                                verticalAlign: "middle",
                                lineHeight: "20px"
                            }}
                        />
                    </Button>
                </div>
            </div>
        );
    },
    renderYAxisInputs: function (theme) {
        let yAxis = this.getYAxis(this.props);
        let components = [];
        yAxis.forEach((y) => {
            components.push(
                <div>
                    <Col className="input-style" md={6}>
                        <Radium.Style
                            rules={inputStyleRules(theme)}
                            scopeSelector=".input-style"
                        />
                        <ControlLabel>{y +" min:"}</ControlLabel>
                        <FormControl
                            type="number"
                            bsStyle={this.getYAxisValidationState()}
                            hasFeedback={true}
                            onChange={input => {
                                let newState = JSON.parse(JSON.stringify(this.state));
                                newState.yAxis[y].min = input.target.value;
                                this.setState(newState);
                            }}
                            style={{...styles(theme).inputLine}}
                            value={this.state.yAxis[y].min}
                        />
                    </Col>
                    <Col className="input-style" md={6}>
                        <Radium.Style
                            rules={inputStyleRules(theme)}
                            scopeSelector=".input-style"
                        />
                        <ControlLabel>{y + " max:"}</ControlLabel>
                        <FormControl
                            type="number"
                            bsStyle={this.getYAxisValidationState()}
                            hasFeedback={true}
                            onChange={input => {
                                let newState = JSON.parse(JSON.stringify(this.state));
                                newState.yAxis[y].max = input.target.value;
                                this.setState(newState);
                            }}
                            style={{...styles(theme).inputLine}}
                            value={this.state.yAxis[y].max}
                        />
                    </Col>
                </div>
            );
        });
        return components;
    },
    renderChartStyleButton: function (theme, chartType, icon) {
        return (
            <Button style={buttonStyle(theme)} onClick={() => {
                this.props.selectChartType(chartType);
            }}
            >
                <Icon
                    color={theme.colors.iconHeader}
                    icon={icon}
                    size={"36px"}
                    style={{lineHeight: "20px"}}
                />
            </Button>
        );
    },
    render: function () {
        const theme = this.getTheme();
        let self = this;
        return (
            <div>
                <SectionToolbar backUrl={"/monitoring/"} title={"Torna all'elenco sensori"} />
                <div style={{width: "75%", padding: "20px", float: "left"}}>
                    {this.renderChart()}
                </div>
                <div style={{
                    width: "25%",
                    backgroundColor: theme.colors.secondary,
                    borderTop: "2px solid " + theme.colors.black,
                    float: "left",
                    height: "calc(100vh - 120px)"
                }}
                >
                    <div style={{
                        padding: "20px",
                        textAlign: "center",
                        borderBottom: "solid 1px",
                        borderColor: theme.colors.white
                    }}
                    >
                        <label style={{
                            color: theme.colors.white,
                            display: "inherit",
                            fontSize: "16px",
                            marginBottom: "10px",
                            textAlign: "center"
                        }}
                        >
                            {"SCEGLI LO STILE DEL GRAFICO"}
                        </label>
                        <div>
                            {this.renderChartStyleButton(theme, "spline", "chart-style1")}
                            {this.renderChartStyleButton(theme, "column", "chart-style2")}
                            {this.renderChartStyleButton(theme, "stacked", "chart-style4")}
                            {this.renderChartStyleButton(theme, "percent", "chart-style3")}
                        </div>
                    </div>
                    {this.renderYAxisValuesChange(theme)}
                    <div style={{padding: "20px", borderBottom: "solid 1px", borderColor: theme.colors.white}}>
                        <div style={{margin: "8px 0px"}}>
                            <Button style={buttonStyle(theme)} onClick={() => {
                                if (self.refs.monitoringChart) {
                                    self.props.addToFavorite(self.refs.monitoringChart.state.config);
                                }
                            }}
                            >
                                <Icon
                                    color={theme.colors.iconHeader}
                                    icon={"star-o"}
                                    size={"28px"}
                                    style={{lineHeight: "20px"}}
                                />
                            </Button>
                            <label style={{
                                marginLeft: "5px",
                                fontSize: "16px",
                                color: theme.colors.navText,
                                fontWeight: "300",
                                cursor: "pointer"
                            }}
                            >
                                {"Aggiungi grafico ai preferiti"}
                            </label>
                        </div>
                        <div style={{margin: "8px 0px"}}>
                            <Link to={"/monitoring/favorites/"}>
                                <Button style={buttonStyle(theme)}>
                                    <Icon
                                        color={theme.colors.iconHeader}
                                        icon={"list-favourite"}
                                        size={"32px"}
                                        style={{lineHeight: "20px"}}
                                    />
                                </Button>
                                <label style={{
                                    marginLeft: "5px",
                                    fontSize: "16px",
                                    color: theme.colors.navText,
                                    fontWeight: "300",
                                    cursor: "pointer"
                                }}
                                >
                                    {"Guarda l'elenco preferiti"}
                                </label>
                            </Link>
                        </div>
                    </div>
                    <div style={{padding: "20px", borderBottom: "solid 1px", borderColor: theme.colors.white}}>
                        <div style={{margin: "8px 0px"}}>
                            <Button style={buttonStyle(theme)}>
                                <Icon
                                    color={theme.colors.iconHeader}
                                    icon={"week"}
                                    size={"32px"}
                                    style={{lineHeight: "20px", verticalAlign: "middle"}}
                                />
                            </Button>
                            <label style={{
                                marginLeft: "5px",
                                fontSize: "16px",
                                color: theme.colors.navText,
                                fontWeight: "300",
                                cursor: "pointer"
                            }}
                            >
                                {"Settimana precedente"}
                            </label>
                        </div>
                        <div style={{margin: "8px 0px"}}>
                            <Button style={buttonStyle(theme)}>
                                <Icon
                                    color={theme.colors.iconHeader}
                                    icon={"month"}
                                    size={"32px"}
                                    style={{lineHeight: "20px", verticalAlign: "middle"}}
                                />
                            </Button>
                            <label style={{
                                marginLeft: "5px",
                                fontSize: "16px",
                                color: theme.colors.navText,
                                fontWeight: "300",
                                cursor: "pointer"
                            }}
                            >
                                {"Mese precedente"}
                            </label>
                        </div>
                        <div style={{margin: "8px 0px"}}>
                            <Button style={buttonStyle(theme)}>
                                <Icon
                                    color={theme.colors.iconHeader}
                                    icon={"year"}
                                    size={"32px"}
                                    style={{lineHeight: "20px", verticalAlign: "middle"}}
                                />
                            </Button>
                            <label style={{
                                marginLeft: "5px",
                                fontSize: "16px",
                                color: theme.colors.navText,
                                fontWeight: "300",
                                cursor: "pointer"
                            }}
                            >
                                {"Anno precedente"}
                            </label>
                        </div>
                    </div>
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
        addToFavorite: bindActionCreators(addToFavorite, dispatch),
        changeYAxisValues: bindActionCreators(changeYAxisValues, dispatch),
        resetYAxisValues: bindActionCreators(resetYAxisValues, dispatch),
        saveChartConfig: bindActionCreators(saveChartConfig, dispatch),
        selectChartType: bindActionCreators(selectChartType, dispatch),
        selectFavoriteChart: bindActionCreators(selectFavoriteChart, dispatch)
    };
};

module.exports = connect(mapStateToProps, mapDispatchToProps)(MonitoringChartView);
