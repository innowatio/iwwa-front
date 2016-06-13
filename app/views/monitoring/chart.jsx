import React, {PropTypes} from "react";
import {Col, Clearfix, ControlLabel, FormControl} from "react-bootstrap";
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
    selectFavoriteChart,
    toggleComparisonChart
} from "actions/monitoring-chart";

import {getUnitOfMeasurement} from "lib/sensors-decorators";
import {extractSensorsFromFormula, getAllSensors, getSensorLabel} from "lib/sensors-utils";
import {styles} from "lib/styles";
import {defaultTheme} from "lib/theme";
import readingsDailyAggregatesToHighchartsData from "lib/readings-daily-aggregates-to-highcharts-data";

import {Button, Icon, MonitoringChart, SectionToolbar, FullscreenModal} from "components";

const inputStyleRules = (theme) => ({
    "": {
        padding: "0px 5px",
        margin: "0px 0px 20px 0px"
    },
    "label.control-label": {
        display: "block",
        color: theme.colors.white,
        fontWeight: "300",
        padding: "0px",
        margin: "0px"
    },
    "label.control-label span": {
        display: "block"
    },
    "input": {
        borderBottom: "1px solid",
        borderColor: theme.colors.white + "!important"
    },
    "span": {
        display: "none"
    }
});

const stylesFunction = (theme, active) => ({
    inputs: {
        width: "90%",
        margin: "0px auto",
        height: "60px",
        fontSize: "20px",
        fontWeight: "300",
        borderRadius: "20px",
        borderColor: theme.colors.borderInputSearch,
        backgroundColor: theme.colors.backgroundInputSearch,
        color: theme.colors.mainFontColor
    },
    labelStyle: {
        color: theme.colors.white,
        display: "inherit",
        marginBottom: "10px",
        textAlign: "center",
        fontWeight: "400",
        fontSize: "16px"
    },
    modalTitleStyle: {
        color: theme.colors.white,
        display: "inherit",
        marginBottom: "50px",
        textAlign: "center",
        fontWeight: "400",
        fontSize: "28px"
    },
    buttonIconStyle: {
        backgroundColor: active ? theme.colors.buttonPrimary : theme.colors.primary,
        border: "0px none",
        borderRadius: "100%",
        height: "50px",
        width: "50px",
        padding: "0px",
        textAlign: "center",
        margin: "0px 5px"
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
        title: React.PropTypes.string,
        toggleComparisonChart: PropTypes.func.isRequired
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
            yAxis: props.monitoringChart.yAxis,
            favoriteName: null
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
    openModal: function () {
        this.setState({showModal:true});
    },
    closeModal: function () {
        this.setState({
            showModal: false,
            value: null
        });
    },
    onConfirmFullscreenModal: function () {
        this.props.addToFavorite(this.refs.monitoringChart.state.config, this.state.favoriteName);
        this.closeModal();
    },
    subscribeToSensorsData: function (props) {
        const sensors = props.monitoringChart.sensorsToDraw;
        let allSensors = this.getAllSensors();
        sensors[0] && sensors.forEach((sensor) => {
            let sensorObj = this.getSensorObj(sensor, allSensors);
            let sensorFormula = sensorObj.get("formulas") ? sensorObj.get("formulas").first() : null;
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
                formula: sensorObj.get("formulas") ? sensorObj.get("formulas").first() : null,
                measurementType: {key: sensorObj.get("measurementType")},
                name: getSensorLabel(sensorObj),
                sensorId: sensorObj.get("_id"),
                source: {key: "reading"},
                unitOfMeasurement: unit
            };
        });
        const readingsDailyAggregates = props.collections.get("readings-daily-aggregates");
        if (readingsDailyAggregates) {
            return readingsDailyAggregatesToHighchartsData(readingsDailyAggregates, monitoringCharts, allSensors);
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
                let val = it.data[i][1];
                isNull = !val || val == 0;
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
                <label style={stylesFunction(theme).labelStyle}>
                    {"CAMBIA VALORI ASSI Y"}
                </label>
                {this.renderYAxisInputs(theme)}
                <div style={{textAlign: "center", marginLeft: "25px"}}>
                    <Button
                        disabled={!this.refs.monitoringChart}
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
                        disabled={!this.refs.monitoringChart}
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
        yAxis.forEach((y, index) => {
            components.push(
                <div key={index}>
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
            <Button
                disabled={!this.refs.monitoringChart}
                onClick={() => this.props.selectChartType(chartType)}
                style={stylesFunction(theme, this.props.monitoringChart.type === chartType).buttonIconStyle}
            >
                <Icon
                    color={theme.colors.white}
                    icon={icon}
                    size={"36px"}
                    style={{lineHeight: "20px"}}
                />
            </Button>
        );
    },
    renderComparisonButton:  function (theme, icon) {
        return (
            <Button
                disabled={!this.refs.monitoringChart}
                onClick={() => this.props.toggleComparisonChart(icon)}
                style={stylesFunction(theme, this.props.monitoringChart.comparisonCharts[icon]).buttonIconStyle}
            >
                <Icon
                    color={theme.colors.white}
                    icon={icon}
                    size={"32px"}
                    style={{lineHeight: "20px", verticalAlign: "middle"}}
                />
            </Button>
        );
    },
    renderFavouriteButton: function () {
        const theme = this.getTheme();
        return (
            <div>
                <Button
                    disabled={!this.refs.monitoringChart}
                    onClick={this.openModal}
                    style={stylesFunction(theme).buttonIconStyle}
                >
                    <Icon
                        color={theme.colors.iconHeader}
                        icon={"star-o"}
                        size={"28px"}
                        style={{lineHeight: "20px"}}
                    />
                </Button>
                <p style={{
                    marginBottom: "25px",
                    fontSize: "16px",
                    color: theme.colors.navText,
                    fontWeight: "300"
                }}
                >
                    {"Aggiungi ai preferiti"}
                </p>
                <FullscreenModal
                    onConfirm={this.onConfirmFullscreenModal}
                    onHide={this.closeModal}
                    onReset={this.closeModal}
                    renderConfirmButton={true}
                    show={this.state.showModal}
                >
                    {this.renderModalBody()}
                </FullscreenModal>
            </div>
        );
    },
    renderModalBody: function () {
        const theme = this.getTheme();
        return (
            <div style={{textAlign: "center"}}>
                <div>
                    <label style={stylesFunction(theme).modalTitleStyle}>
                        {"AGGIUNGI GRAFICO AI PREFERITI"}
                    </label>
                </div>
                <FormControl
                    bsSize="small"
                    onChange={input => this.setState({favoriteName: input.target.value})}
                    placeholder={"Inserisci il nome per il tuo grafico"}
                    style={stylesFunction(theme).inputs}
                    type="text"
                />
            </div>
        );
    },
    render: function () {
        const theme = this.getTheme();
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
                        <label style={stylesFunction(theme).labelStyle}>
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
                    <div style={{textAlign: "center", marginTop: "25px", borderBottom: "solid 1px", borderColor: theme.colors.white}}>
                        <Col lg={6} md={6} xs={12}>
                            {this.renderFavouriteButton()}
                        </Col>
                        <Col className="link" lg={6} md={6} xs={12}>
                            <Radium.Style
                                rules={{
                                    ":hover": {
                                        textDecoration: "none"
                                    },
                                    ".btn-default:hover": {
                                        backgroundColor: theme.colors.buttonPrimary + "!important"
                                    }
                                }}
                                scopeSelector=".link"
                            />
                            <Link to={"/monitoring/favorites/"}>
                                <Button style={stylesFunction(theme).buttonIconStyle}>
                                    <Icon
                                        color={theme.colors.iconHeader}
                                        icon={"list-favourite"}
                                        size={"32px"}
                                        style={{lineHeight: "20px"}}
                                    />
                                </Button>
                            </Link>
                            <p style={{
                                marginBottom: "25px",
                                fontSize: "16px",
                                color: theme.colors.navText,
                                fontWeight: "300",
                                textDecoratio: "none"
                            }}
                            >
                                {"Visualizza elenco"}
                            </p>
                        </Col>
                        <Clearfix>{}</Clearfix>
                    </div>
                    <div style={{textAlign: "center", padding: "20px", borderBottom: "solid 1px", borderColor: theme.colors.white}}>
                        <label style={stylesFunction(theme).labelStyle}>
                            {"VEDI SETTIMANA/MESE/ANNO PRECEDENTE:"}
                        </label>
                        <div>
                            {this.renderComparisonButton(theme, "week")}
                            {this.renderComparisonButton(theme, "month")}
                            {this.renderComparisonButton(theme, "year")}
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
        selectFavoriteChart: bindActionCreators(selectFavoriteChart, dispatch),
        toggleComparisonChart: bindActionCreators(toggleComparisonChart, dispatch)
    };
};
module.exports = connect(mapStateToProps, mapDispatchToProps)(MonitoringChartView);
