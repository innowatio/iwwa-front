import {Button} from "react-bootstrap";
import Table from "bootstrap-table-react";
import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router";
import {bindActionCreators} from "redux";
import {deleteSensor, cloneSensor, favoriteSensor, monitorSensor, selectSensor, combineSensor} from "actions/sensors";
import {addToFavorite, selectChartType} from "actions/monitoring-chart";
import {MonitoringChart} from "components";

var Monitoring = React.createClass({
    propTypes: {
        addToFavorite: React.PropTypes.func.isRequired,
        cloneSensor: React.PropTypes.func.isRequired,
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
    getColumns: function () {
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
                key: "name",
                valueFormatter: (value, item) => (
                    <Link to={"/monitoring/sensor/" + item.id}>
                        {item.fields.name}
                    </Link>
                )
            },
            {
                key: "description",
                valueFormatter: (value, item) => (
                    item.fields.description
                )
            },
            {
                key: "",
                valueFormatter: (value, item) => (
                    <div>
                        <Button onClick={this.getCloneSensor(item.id)}>
                            {"Clone"}
                        </Button>
                        <Button bsStyle="danger" onClick={this.getDeleteSensor(item.id)}>
                            {"Delete"}
                        </Button>
                    </div>
                )
            }
        ];
    },
    render: function () {
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
                <Table
                    collection={this.props.sensors}
                    columns={this.getColumns()}
                    onRowClick={this.props.selectSensor}
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