import Immutable from "immutable";
import React, {PropTypes} from "react";
import IPropTypes from "react-immutable-proptypes";
import {connect} from "react-redux";
import {Link} from "react-router";
import {bindActionCreators} from "redux";

import {addToFavorite, changeYAxisValues, saveChartConfig, selectChartType, selectFavoriteChart} from "actions/monitoring-chart";

import {defaultTheme} from "lib/theme";

import {Button, Icon, MonitoringChart, SectionToolbar} from "components";

const buttonStyle = ({colors}) => ({
    backgroundColor: colors.buttonPrimary,
    border: "0px none",
    borderRadius: "100%",
    height: "50px",
    margin: "auto",
    width: "50px",
    marginLeft: "10px"
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
        selectFavoriteChart: PropTypes.func.isRequired,
        selected: PropTypes.array
    },
    contextTypes: {
        theme: PropTypes.object
    },
    componentDidMount: function () {
        this.subscribeToSensorsData(this.props);
    },
    subscribeToSensorsData: function (props) {
        console.log(props.selected);
        props.selected[0] && props.selected.forEach((sensorId) => {
            //TODO capire bene cosa va preso...
            props.asteroid.subscribe(
                "dailyMeasuresBySensor",
                sensorId,
                "2015-01-01",
                "2016-03-01",
                "reading",
                "activeEnergy"
            );
        });
    },
    getChartSeries: function () {
        let measures = this.props.collections.get("readings-daily-aggregates") || Immutable.Map();
        console.log(measures);
        //TODO prendere le misure
        return this.props.selected;
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    render: function () {
        const theme = this.getTheme();
        return (
            <div>
                <SectionToolbar backUrl={"/monitoring/"} title={"Torna all'elenco sensori"} />

                <MonitoringChart
                    onChangeYAxisValues={this.props.changeYAxisValues}
                    chartState={this.props.monitoringChart}
                    saveConfig={this.props.saveChartConfig}
                    series={this.getChartSeries()}
                    style={{width: "75%", padding: "20px", float: "left"}}
                />

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
                    </div>
                    <div style={{padding: "20px", borderBottom: "solid 1px", borderColor: theme.colors.white}}>
                        <div>
                            <Button style={buttonStyle(theme)}  onClick={this.props.addToFavorite}>
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
        monitoringChart: state.monitoringChart,
        selected: state.sensors.selectedSensors
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