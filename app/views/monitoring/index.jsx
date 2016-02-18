import { Button } from 'react-bootstrap';
import Table from 'bootstrap-table-react';
import React from "react";
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { bindActionCreators } from 'redux';
import { editSensor, deleteSensor, cloneSensor, favoriteSensor, monitorSensor, selectSensor, combineSensor } from 'actions/sensors'

const mapStateToProps = (state) => {
    return {
        sensors: state.sensors.allSensors,
        selected: state.sensors.selectedSensors
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        deleteSensor: bindActionCreators(deleteSensor, dispatch),
        cloneSensor: bindActionCreators(cloneSensor, dispatch),
        favoriteSensor: bindActionCreators(favoriteSensor, dispatch),
        monitorSensor: bindActionCreators(monitorSensor, dispatch),
        selectSensor: bindActionCreators(selectSensor, dispatch),
        combineSensor: bindActionCreators(combineSensor, dispatch)
    };
};

var Monitoring = React.createClass({
    getDeleteSensor: function(id) {
        return () => {
            this.props.deleteSensor(id);
        };
    },
    getCloneSensor: function(id) {
        return () => {
            this.props.cloneSensor(id);
        };
    },
    getFavoriteSensor: function(id) {
        return () => {
            this.props.favoriteSensor(id);
        };
    },
    getMonitorSensor: function(id) {
        return () => {
            this.props.monitorSensor(id);
        };
    },
    getColumns: function() {
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
                    <Link to={"/sensor/" + item.id}>
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
                            Clone
                        </Button>
                        <Button bsStyle="danger" onClick={this.getDeleteSensor(item.id)}>
                            Delete
                        </Button>
                    </div>
                )
            }
        ];
    },
    render: function () {
        return(
            <div>
                <Button bsStyle="primary" href="#/sensor/">Add sensor</Button>
                <Button onClick={this.props.combineSensor} disabled={!(this.props.selected.length > 1)} >
                    Combine sensors
                </Button>
                <Button disabled={!(this.props.selected.length > 0)} >
                    Assign sensors
                </Button>
                <Table
                    collection={this.props.sensors}
                    columns={this.getColumns()}
                    onRowClick={this.props.selectSensor}
                />
            </div>
        );
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Monitoring);