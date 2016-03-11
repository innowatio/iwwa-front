import Immutable from "immutable";
import React, {PropTypes} from "react";
import IPropTypes from "react-immutable-proptypes";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {cloneSensor, combineSensor, deleteSensor, favoriteSensor, monitorSensor, selectSensor} from "actions/sensors";
import {addToFavorite, changeYAxisValues, selectChartType, selectFavoriteChart} from "actions/monitoring-chart";
import {Button, CollectionElementsTable, Icon, MonitoringChart, MonitoringSearch, SectionToolbar} from "components";
import {defaultTheme} from "lib/theme";

const buttonStyle = ({colors}) => ({
    background: colors.titleColor,
    border: "0px none",
    borderRadius: "100%",
    height: "50px",
    margin: "auto",
    width: "50px"
});


var getKeyFromCollection = function (collection) {
    return collection.get("_id");
};

var Monitoring = React.createClass({
    propTypes: {
        addToFavorite: PropTypes.func.isRequired,
        asteroid: PropTypes.object,
        changeYAxisValues: PropTypes.func.isRequired,
        cloneSensor: PropTypes.func.isRequired,
        collections: IPropTypes.map.isRequired,
        combineSensor: PropTypes.func.isRequired,
        deleteSensor: PropTypes.func.isRequired,
        favoriteSensor: PropTypes.func.isRequired,
        monitorSensor: PropTypes.func.isRequired,
        monitoringChart: PropTypes.object.isRequired,
        selectChartType: PropTypes.func.isRequired,
        selectFavoriteChart: PropTypes.func.isRequired,
        selectSensor: PropTypes.func.isRequired,
        selected: PropTypes.array,
        sensors: PropTypes.array.isRequired
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
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    getDeleteSensor: function (id) {
        return () => {
            this.props.deleteSensor(id);
        };
    },
    getCloneSensor: function (id) {
        return () => {
            this.props.cloneSensor(id);
        };
    },
    getFavoriteSensor: function (id) {
        return () => {
            this.props.favoriteSensor(id);
        };
    },
    getMonitorSensor: function (id) {
        return () => {
            this.props.monitorSensor(id);
        };
    },
    getFavoritesChartsColumns: function () {
        return [
            {key: "_id"}
        ];
    },
    getSensorsColumns: function () {
        const theme = this.getTheme();
        return [
            {
                key: "_id",
                style: function () {
                    return {
                        borderRight: "solid 1px grey",
                        width: "10%",
                        height: "100%",
                        textAlign: "left"
                    };
                }
            },
            {
                key: "tag",
                style: function () {
                    return {
                        width: "80%",
                        height: "100%",
                        padding: "3px 0px 0px 5px",
                        textAlign: "left"
                    };
                },
                valueFormatter: () => (
                    <div>
                        <Icon
                            color={theme.colors.iconHeader}
                            icon={"tag"}
                            size={"27px"}
                        />
                    </div>
                )
            },
            {
                key: "info",
                valueFormatter: () => (
                    <Icon
                        color={theme.colors.iconHeader}
                        icon={"info"}
                        size={"27px"}
                    />
                )
            },
            {
                key: "chart",
                style: function () {
                    return {
                        backgroundColor: "grey"
                    };
                },
                valueFormatter: () => (
                    <Icon
                        color={theme.colors.iconHeader}
                        icon={"chart"}
                        size={"27px"}
                    />
                )
            },
            {
                key: "",
                valueFormatter: () => (
                    <div />
                )
            }
        ];
    },
    getChartSeries: function () {
        let measures = this.props.collections.get("readings-daily-aggregates") || Immutable.Map();
        console.log(measures);
        //TODO prendere le misure
        return this.props.selected;
    },
    render: function () {
        let sensors = this.props.collections.get("sensors") || Immutable.Map();
        const theme = this.getTheme();
            //{
            //    key: "",
            //    valueFormatter: (value, item) => (
            //        <div>
            //            <Button onClick={this.getCloneSensor(item.get("_id"))}>
            //                {"Clone"}
            //            </Button>
            //            <Button bsStyle="danger" onClick={this.getDeleteSensor(item.get("_id"))}>
            //                {"Delete"}
            //            </Button>
            //        </div>
            //    )
            //}
        //<Button bsStyle="primary" href="/monitoring/sensor/">
        //    {"Add sensor"}
        //</Button>
        //<Button disabled={!(this.props.selected.length > 1)} onClick={this.props.combineSensor} >
        //    {"Combine sensors"}
        //</Button>
        //<Button disabled={!(this.props.selected.length > 0)} >
        //    {"Assign sensors"}
        //</Button>
        return (
            <div>
                <SectionToolbar>
                    <Button style={buttonStyle(theme)}>
                        <Icon
                            color={theme.colors.iconHeader}
                            icon={"add"}
                            size={"28px"}
                            style={{lineHeight: "20px"}}
                        />
                    </Button>
                    <Button style={buttonStyle(theme)} disabled={!(this.props.selected.length > 1)} onClick={this.props.combineSensor}>
                        <Icon
                            color={theme.colors.iconHeader}
                            icon={"duplicate"}
                            size={"28px"}
                            style={{lineHeight: "20px"}}
                        />
                    </Button>
                    <Button style={buttonStyle(theme)} disabled={!(this.props.selected.length > 0)}>
                        <Icon
                            color={theme.colors.iconHeader}
                            icon={"edit"}
                            size={"28px"}
                            style={{lineHeight: "20px"}}
                        />
                    </Button>
                    <Button style={buttonStyle(theme)}>
                        <Icon
                            color={theme.colors.iconHeader}
                            icon={"delete"}
                            size={"28px"}
                            style={{lineHeight: "20px"}}
                        />
                    </Button>
                </SectionToolbar>

                <MonitoringSearch
                    style={{width: "25%", float: "left", marginTop: "2px", minHeight: "714px"}}
                />

                <div style={{float: "left", width: "75%", textAlign: "center", padding: "10px 10px 0px 20px"}}>
                    <label style={{color: theme.colors.navText}}>
                        {"Seleziona alcuni sensori per visualizzare il grafico o per creare un nuovo sensore"}
                    </label>
                    <CollectionElementsTable
                        collection={sensors}
                        columns={this.getSensorsColumns()}
                        getKey={getKeyFromCollection}
                        hover={true}
                        onRowClick={this.props.selectSensor}
                        style={{color: "white", border: "grey solid 1px", borderRadius: "30px", background: "black", maxHeight: "332px", overflow: "auto", padding: 0}}
                        width={"60%"}
                    />

                    <div style={{border: "grey solid 1px", borderRadius: "30px", background: "black", marginTop: "50px", minHeight: "300px", overflow: "auto", padding: 0, verticalAlign: "middle"}}>
                        <label style={{color: theme.colors.navText}}>
                            {"Trascina in questo spazio i sensori che vuoi graficare"}
                        </label>
                    </div>

                </div>
                <div>
                    <h3>
                        {"Favorites charts"}
                    </h3>
                    <CollectionElementsTable
                        collection={this.props.monitoringChart.favorites}
                        columns={this.getFavoritesChartsColumns()}
                        getKey={getKeyFromCollection}
                        hover={true}
                        onRowClick={this.props.selectFavoriteChart}
                        width={"60%"}
                    />
                </div>

                <MonitoringChart
                    addToFavorite={this.props.addToFavorite}
                    onChangeYAxisValues={this.props.changeYAxisValues}
                    chartState={this.props.monitoringChart}
                    selectChartType={this.props.selectChartType}
                    series={this.getChartSeries()}
                />
            </div>
        );
    }
});

const mapStateToProps = (state) => {
    return {
        collections: state.collections,
        monitoringChart: state.monitoringChart,
        selected: state.sensors.selectedSensors,
        sensors: state.sensors.allSensors
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addToFavorite: bindActionCreators(addToFavorite, dispatch),
        changeYAxisValues: bindActionCreators(changeYAxisValues, dispatch),
        cloneSensor: bindActionCreators(cloneSensor, dispatch),
        combineSensor: bindActionCreators(combineSensor, dispatch),
        deleteSensor: bindActionCreators(deleteSensor, dispatch),
        favoriteSensor: bindActionCreators(favoriteSensor, dispatch),
        monitorSensor: bindActionCreators(monitorSensor, dispatch),
        selectChartType: bindActionCreators(selectChartType, dispatch),
        selectFavoriteChart: bindActionCreators(selectFavoriteChart, dispatch),
        selectSensor: bindActionCreators(selectSensor, dispatch)
    };
};

module.exports = connect(mapStateToProps, mapDispatchToProps)(Monitoring);