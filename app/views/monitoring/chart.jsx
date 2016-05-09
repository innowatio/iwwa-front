import React, {PropTypes} from "react";
import {Col, Input} from "react-bootstrap";
import IPropTypes from "react-immutable-proptypes";
import {connect} from "react-redux";
import {Link} from "react-router";
import {bindActionCreators} from "redux";
import moment from "moment";
import Radium from "radium";

import {
    addToFavorite,
    changeYAxisValues,
    saveChartConfig,
    selectChartType,
    selectFavoriteChart
} from "actions/monitoring-chart";

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

var MonitoringChartView = React.createClass({
    propTypes: {
        addToFavorite: PropTypes.func.isRequired,
        asteroid: PropTypes.object,
        changeYAxisValues: PropTypes.func.isRequired,
        collections: IPropTypes.map.isRequired,
        monitoringChart: PropTypes.object.isRequired,
        saveChartConfig: PropTypes.func.isRequired,
        selectChartType: PropTypes.func.isRequired,
        selectFavoriteChart: PropTypes.func.isRequired
    },
    contextTypes: {
        theme: PropTypes.object
    },
    getInitialState: function () {
        return this.getStateFromProps(this.props);
    },
    componentDidMount: function () {
        this.subscribeToSensorsData(this.props);
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
        return {
            yAxisMax: props.monitoringChart.yAxis.max,
            yAxisMin: props.monitoringChart.yAxis.min
        };
    },
    subscribeToSensorsData: function (props) {
        const sensors = props.monitoringChart.sensorsToDraw;
        sensors[0] && sensors.forEach((sensor) => {
            // last year for sensors
            let sensorId = typeof sensor === "string" ? sensor : sensor.get("_id");
            props.asteroid.subscribe(
                "dailyMeasuresBySensor",
                sensorId,
                moment.utc().subtract(1, "years").startOf("month").format("YYYY-MM-DD"),
                moment.utc().endOf("month").format("YYYY-MM-DD"),
                "reading",
                "activeEnergy"
            );
        });
    },
    getChartSeries: function () {
        const monitoringCharts = this.props.monitoringChart.sensorsToDraw.map(sensor => {
            let sensorId = typeof sensor === "string" ? sensor : sensor.get("_id");
            return {
                date: {
                    start: moment.utc().startOf("month").valueOf(),
                    end: moment.utc().endOf("month").valueOf()
                },
                source: {key: "reading"},
                measurementType: {key: "activeEnergy"},
                name: sensorId,
                sensorId: sensorId
            };
        });
        const readingsDailyAggregates = this.props.collections.get("readings-daily-aggregates");
        if (readingsDailyAggregates) {
            return readingsDailyAggregatesToHighchartsData(readingsDailyAggregates, monitoringCharts);
        }
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    handleAxisChange: function () {
        this.setState({
            yAxisMax: this.refs.yAxisMax.getValue(),
            yAxisMin: this.refs.yAxisMin.getValue()
        });
    },
    getYAxisValidationState: function () {
        let {yAxisMin, yAxisMax} = this.state;
        if (isNaN(yAxisMin) || isNaN(yAxisMax)) return "error";
        if (parseInt(yAxisMin) > parseInt(yAxisMax)) return "warning";
        return "success";
    },
    changeYAxisValues: function () {
        this.props.changeYAxisValues({
            max: this.state.yAxisMax,
            min: this.state.yAxisMin
        });
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
    renderChart: function () {
        let series = this.getChartSeries();
        if (series && !this.haveNullSeries(series)) {
            return (
                <MonitoringChart
                    chartState={this.props.monitoringChart}
                    ref="monitoringChart"
                    saveConfig={this.props.saveChartConfig}
                    series={series}
                />
            );
        }
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
                            <Button style={buttonStyle(theme)} onClick={() => {
                                this.props.selectChartType("spline");
                            }}
                            >
                                <Icon
                                    color={theme.colors.iconHeader}
                                    icon={"chart-style1"}
                                    size={"36px"}
                                    style={{lineHeight: "20px"}}
                                />
                            </Button>
                            <Button style={buttonStyle(theme)} onClick={() => {
                                this.props.selectChartType("column");
                            }}
                            >
                                <Icon
                                    color={theme.colors.iconHeader}
                                    icon={"chart-style2"}
                                    size={"36px"}
                                    style={{lineHeight: "20px"}}
                                />
                            </Button>
                            <Button style={buttonStyle(theme)} onClick={() => {
                                this.props.selectChartType("stacked");
                            }}
                            >
                                <Icon
                                    color={theme.colors.iconHeader}
                                    icon={"chart-style3"}
                                    size={"36px"}
                                    style={{lineHeight: "20px"}}
                                />
                            </Button>
                            <Button style={buttonStyle(theme)} onClick={() => {
                                this.props.selectChartType("percent");
                            }}
                            >
                                <Icon
                                    color={theme.colors.iconHeader}
                                    icon={"chart-style4"}
                                    size={"36px"}
                                    style={{lineHeight: "20px"}}
                                />
                            </Button>
                        </div>
                    </div>
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
                            {"CAMBIA VALORI ASSI"}
                        </label>
                        <Col className="input-style" md={6}>
                            <Radium.Style
                                rules={{
                                    "": {
                                        padding: "0px 5px",
                                        margin: "0px"
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
                                }}
                                scopeSelector=".input-style"
                            />
                            <Input
                                type="text"
                                value={this.state.yAxisMin}
                                label="Asse Y min:"
                                bsStyle={this.getYAxisValidationState()}
                                hasFeedback={true}
                                ref="yAxisMin"
                                onChange={this.handleAxisChange}
                                style={{...styles(theme).inputLine}}
                            />
                        </Col>
                        <Col className="input-style" md={6}>
                            <Radium.Style
                                rules={{
                                    "": {
                                        padding: "0px 5px",
                                        margin: "0px"
                                    },
                                    "label.control-label": {
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
                                }}
                                scopeSelector=".input-style"
                            />
                            <Input
                                type="text"
                                value={this.state.yAxisMax}
                                label="Asse Y max:"
                                bsStyle={this.getYAxisValidationState()}
                                hasFeedback={true}
                                ref="yAxisMax"
                                onChange={this.handleAxisChange}
                                style={{...styles(theme).inputLine}}
                            />
                        </Col>
                        <div style={{textAlign: "center"}}>
                            <Button
                                onClick={this.changeYAxisValues}
                                style={{
                                    ...styles(theme).buttonSelectChart,
                                    width: "120px",
                                    height: "40px",
                                    lineHeight: "40px",
                                    padding: "0",
                                    margin: "0px 0px 0px 30px",
                                    fontSize: "20px",
                                    border: "0px",
                                    backgroundColor: this.getTheme().colors.buttonPrimary
                                }}
                            >
                                {"OK"}
                            </Button>
                            <Button bsStyle={"link"}>
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
                    <div style={{padding: "20px", borderBottom: "solid 1px", borderColor: theme.colors.white}}>
                        <div style={{margin: "8px 0px"}}>
                            <Button style={buttonStyle(theme)}  onClick={() => {
                                this.props.addToFavorite(this.refs.monitoringChart.state.config);
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
                            <Button style={buttonStyle(theme)}  onClick={() => {
                                this.props.addToFavorite(this.refs.monitoringChart.state.config);
                            }}
                            >
                                <Icon
                                    color={theme.colors.iconHeader}
                                    icon={"calendar"}
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
                                {"Settimana precedente"}
                            </label>
                        </div>
                        <div style={{margin: "8px 0px"}}>
                            <Button style={buttonStyle(theme)}  onClick={() => {
                                this.props.addToFavorite(this.refs.monitoringChart.state.config);
                            }}
                            >
                                <Icon
                                    color={theme.colors.iconHeader}
                                    icon={"calendar"}
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
                                {"Mese precedente"}
                            </label>
                        </div>
                        <div style={{margin: "8px 0px"}}>
                            <Button style={buttonStyle(theme)}  onClick={() => {
                                this.props.addToFavorite(this.refs.monitoringChart.state.config);
                            }}
                            >
                                <Icon
                                    color={theme.colors.iconHeader}
                                    icon={"calendar"}
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
        saveChartConfig: bindActionCreators(saveChartConfig, dispatch),
        selectChartType: bindActionCreators(selectChartType, dispatch),
        selectFavoriteChart: bindActionCreators(selectFavoriteChart, dispatch)
    };
};

module.exports = connect(mapStateToProps, mapDispatchToProps)(MonitoringChartView);
