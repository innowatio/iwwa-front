import Immutable from "immutable";
import React from "react";
import {Button} from "react-bootstrap";
import IPropTypes from "react-immutable-proptypes";
import {connect} from "react-redux";
import {Link} from "react-router";
import {bindActionCreators} from "redux";
import {deleteSensor, cloneSensor, favoriteSensor, monitorSensor, selectSensor, combineSensor} from "actions/sensors";
import {addToFavorite, selectChartType} from "actions/monitoring-chart";
import {CollectionElementsTable, MonitoringChart} from "components";

var getKeyFromCollection = function (collection) {
    return collection.get("_id");
};

var Monitoring = React.createClass({
    propTypes: {
        addToFavorite: React.PropTypes.func.isRequired,
        asteroid: React.PropTypes.object,
        cloneSensor: React.PropTypes.func.isRequired,
        collections: IPropTypes.map.isRequired,
        combineSensor: React.PropTypes.func.isRequired,
        deleteSensor: React.PropTypes.func.isRequired,
        favoriteSensor: React.PropTypes.func.isRequired,
        monitorSensor: React.PropTypes.func.isRequired,
        monitoringChart: React.PropTypes.object.isRequired,
        selectChartType: React.PropTypes.func.isRequired,
        selectSensor: React.PropTypes.func.isRequired,
        selected: React.PropTypes.array,
        sensors: React.PropTypes.array.isRequired
    },
    componentDidMount: function () {
        this.props.asteroid.subscribe("sensors");
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
    getSensorsColumns: function () {
        return [
            {
                key: "Favorite",
                valueFormatter: (value, item) => (
                    <i className={"fa fa-star" + (item.favorite ? "" : "-o") + " clickable"} onClick={this.getFavoriteSensor(item.id)}/>
                )
            },
            {
                key: "Monitoring",
                valueFormatter: (value, item) => (
                    <i className={"fa " + (item.monitoring ? "fa-stop" : "fa-play") + " clickable"} onClick={this.getMonitorSensor(item.id)}/>
                )
            },
            {
                key: "_id",
                valueFormatter: (value) => (
                    <Link to={"/monitoring/sensor/" + value}>
                        {value}
                    </Link>
                )
            },
            {
                key: "description"
            },
            {
                key: "",
                valueFormatter: (value, item) => (
                    <div>
                        <Button onClick={this.getCloneSensor(item.get("_id"))}>
                            {"Clone"}
                        </Button>
                        <Button bsStyle="danger" onClick={this.getDeleteSensor(item.get("_id"))}>
                            {"Delete"}
                        </Button>
                    </div>
                )
            }
        ];
    },
    render: function () {
        let sensors = this.props.collections.get("sensors") || Immutable.Map();
        return (
            <div>
                <Button bsStyle="primary" href="/monitoring/sensor/">
                    {"Add sensor"}
                </Button>
                <Button disabled={!(this.props.selected.length > 1)} onClick={this.props.combineSensor} >
                    {"Combine sensors"}
                </Button>
                <Button disabled={!(this.props.selected.length > 0)} >
                    {"Assign sensors"}
                </Button>
                <CollectionElementsTable
                    collection={sensors}
                    columns={this.getSensorsColumns()}
                    getKey={getKeyFromCollection}
                    hover={true}
                    onRowClick={this.props.selectSensor}
                    width={"60%"}
                />
                <MonitoringChart
                    addToFavorite={this.props.addToFavorite}
                    chartState={this.props.monitoringChart}
                    selectChartType={this.props.selectChartType}
                    series={this.props.selected}
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
        cloneSensor: bindActionCreators(cloneSensor, dispatch),
        combineSensor: bindActionCreators(combineSensor, dispatch),
        deleteSensor: bindActionCreators(deleteSensor, dispatch),
        favoriteSensor: bindActionCreators(favoriteSensor, dispatch),
        monitorSensor: bindActionCreators(monitorSensor, dispatch),
        selectChartType: bindActionCreators(selectChartType, dispatch),
        selectSensor: bindActionCreators(selectSensor, dispatch)
    };
};

module.exports = connect(mapStateToProps, mapDispatchToProps)(Monitoring);