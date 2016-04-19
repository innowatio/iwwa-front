import Immutable from "immutable";
import {merge, prop} from "ramda";
import React, {PropTypes} from "react";
import {Col, Input} from "react-bootstrap";
import IPropTypes from "react-immutable-proptypes";
import {connect} from "react-redux";
import {Link} from "react-router";
import {bindActionCreators} from "redux";
import moment from "moment";

import {
    addToFavorite,
    changeYAxisValues,
    saveChartConfig,
    selectChartType,
    selectDateRanges,
    selectFavoriteChart,
    setZoomExtremes,
    resetZoom} from "actions/monitoring-chart";

import {styles} from "lib/styles_restyling";
import {defaultTheme} from "lib/theme";
import readingsDailyAggregatesToHighchartsData from "lib/readings-daily-aggregates-to-highcharts-data";

import {Button, ButtonGroupSelect, Icon, MonitoringChart, SectionToolbar} from "components";

const buttonStyle = ({colors}) => ({
    backgroundColor: colors.buttonPrimary,
    border: "0px none",
    borderRadius: "100%",
    height: "50px",
    margin: "auto",
    width: "50px",
    marginLeft: "10px"
});

const sourceButtonStyle = (theme) => merge(styles(theme).buttonSelectChart, {
    minWidth: "85px",
    height: "30px",
    fontWeight: "300"
});

var MonitoringChartView = React.createClass({
    propTypes: {
        addToFavorite: PropTypes.func.isRequired,
        asteroid: PropTypes.object,
        changeYAxisValues: PropTypes.func.isRequired,
        collections: IPropTypes.map.isRequired,
        monitoringChart: PropTypes.object.isRequired,
        resetZoom: PropTypes.func.isRequired,
        saveChartConfig: PropTypes.func.isRequired,
        selectChartType: PropTypes.func.isRequired,
        selectDateRanges: PropTypes.func.isRequired,
        selectFavoriteChart: PropTypes.func.isRequired,
        setZoomExtremes: PropTypes.func.isRequired
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
        const sensors = props.monitoringChart.sensorsToDraw.map(sensor => sensor.get("_id"));
        sensors[0] && sensors.forEach((sensorId) => {
            // last year for sensors
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
            console.log(sensor);
            return {
                date: {
                    start: moment.utc().startOf("month").valueOf(),
                    end: moment.utc().endOf("month").valueOf()
                },
                source: {key: "reading"},
                measurementType: {key: "activeEnergy"},
                name: sensor.get("_id"),
                favorites: Immutable.Map(),
                type: "spline",
                sensorId: sensor.get("_id"),
                yAxis: {
                    min: 0,
                    max: 60
                }
            };
        });
        const readingsDailyAggregates = this.props.collections.get("readings-daily-aggregates") || Immutable.Map();
        let measures = readingsDailyAggregatesToHighchartsData(readingsDailyAggregates, monitoringCharts);
        return measures;
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
    render: function () {
        const theme = this.getTheme();
        return (
            <div>
                <SectionToolbar backUrl={"/monitoring/"} title={"Torna all'elenco sensori"} />
                <div style={{width: "75%", padding: "20px", float: "left"}}>
                    <div style={{paddingBottom: "20px", paddingTop: "10px"}}>
                        <ButtonGroupSelect
                            allowedValues={this.getFilters()}
                            getKey={prop("key")}
                            getLabel={prop("label")}
                            onChange={this.props.selectDateRanges}
                            style={sourceButtonStyle(this.getTheme())}
                            styleToMergeWhenActiveState={{
                                background: theme.colors.backgroundChartSelectedButton,
                                color: theme.colors.textSelectButton,
                                border: `1px solid ${theme.colors.borderChartSelectedButton}`
                            }}
                            value={this.props.monitoringChart.dateRanges}
                        />
                    </div>
                    <MonitoringChart
                        chartState={this.props.monitoringChart}
                        dateRanges={this.props.monitoringChart.dateRanges}
                        ref="monitoringChart"
                        saveConfig={this.props.saveChartConfig}
                        series={this.getChartSeries()}
                        setZoomExtremes={this.props.setZoomExtremes}
                        resetZoom={this.props.resetZoom}
                    />
                </div>
                <div style={{width: "25%", backgroundColor: theme.colors.primary, float: "left", minHeight: "600px"}}>
                    <div style={{padding: "20px", borderBottom: "solid 1px", borderColor: theme.colors.white}}>
                        <label style={{color: theme.colors.navText, display: "inherit"}}>
                            {"SCEGLI LO STILE DEL GRAFICO"}
                        </label>
                        <div style={{textAlign: "center"}}>
                            <Button style={buttonStyle(theme)} onClick={() => {
                                this.props.selectChartType("spline");
                            }}
                            >
                                <Icon
                                    color={theme.colors.iconHeader}
                                    icon={"add"}
                                    size={"28px"}
                                    style={{lineHeight: "20px"}}
                                />
                            </Button>
                            <Button style={buttonStyle(theme)} onClick={() => {
                                this.props.selectChartType("column");
                            }}
                            >
                                <Icon
                                    color={theme.colors.iconHeader}
                                    icon={"add"}
                                    size={"28px"}
                                    style={{lineHeight: "20px"}}
                                />
                            </Button>
                            <Button style={buttonStyle(theme)} onClick={() => {
                                this.props.selectChartType("stacked");
                            }}
                            >
                                <Icon
                                    color={theme.colors.iconHeader}
                                    icon={"add"}
                                    size={"28px"}
                                    style={{lineHeight: "20px"}}
                                />
                            </Button>
                            <Button style={buttonStyle(theme)} onClick={() => {
                                this.props.selectChartType("percent");
                            }}
                            >
                                <Icon
                                    color={theme.colors.iconHeader}
                                    icon={"add"}
                                    size={"28px"}
                                    style={{lineHeight: "20px"}}
                                />
                            </Button>
                        </div>
                    </div>
                    <div style={{padding: "20px", borderBottom: "solid 1px", borderColor: theme.colors.white}}>
                        <label style={{color: theme.colors.navText, display: "inherit"}}>
                            {"CAMBIA VALORI ASSI"}
                        </label>
                        <Col md={6}>
                            <Input
                                type="text"
                                value={this.state.yAxisMin}
                                label="Asse Y min"
                                bsStyle={this.getYAxisValidationState()}
                                hasFeedback={true}
                                ref="yAxisMin"
                                onChange={this.handleAxisChange}
                                style={{...styles(theme).inputLine}}
                            />
                        </Col>
                        <Col md={6}>
                            <Input
                                type="text"
                                value={this.state.yAxisMax}
                                label="Asse Y max"
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
                                    width: "40px",
                                    height: "40px",
                                    lineHeight: "40px",
                                    padding: "0",
                                    marginTop: "none",
                                    fontSize: "20px",
                                    marginRight: "none",
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
                        <div>
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
                            <label style={{color: theme.colors.navText}}>
                                {"Aggiungi grafico ai preferiti"}
                            </label>
                        </div>
                        <div>
                            <Link to={"/monitoring/favorites/"}>
                                <Button style={buttonStyle(theme)}>
                                    <Icon
                                        color={theme.colors.iconHeader}
                                        icon={"star-o"}
                                        size={"28px"}
                                        style={{lineHeight: "20px"}}
                                    />
                                </Button>
                            </Link>
                            <label style={{color: theme.colors.navText}}>
                                {"Guarda l'elenco preferiti"}
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
        resetZoom: bindActionCreators(resetZoom, dispatch),
        saveChartConfig: bindActionCreators(saveChartConfig, dispatch),
        selectChartType: bindActionCreators(selectChartType, dispatch),
        selectDateRanges: bindActionCreators(selectDateRanges, dispatch),
        selectFavoriteChart: bindActionCreators(selectFavoriteChart, dispatch),
        setZoomExtremes: bindActionCreators(setZoomExtremes, dispatch)
    };
};

module.exports = connect(mapStateToProps, mapDispatchToProps)(MonitoringChartView);
