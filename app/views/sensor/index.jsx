import R from "ramda";
import React from "react";
import {connect} from "react-redux";
import {routeActions} from "react-router-redux";
import {bindActionCreators} from "redux";
import {editSensor, addSensor} from "actions/sensors";
import SensorForm from "components/sensor-form/";

const mapStateToProps = (state) => {
    return {
        sensors: state.sensors.allSensors
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addSensor: bindActionCreators(addSensor, dispatch),
        editSensor: bindActionCreators(editSensor, dispatch),
        navigateTo: (path) => dispatch(routeActions.push(path))
    };
};

var Sensor = React.createClass({
    propTypes: {
        addSensor: React.PropTypes.func.isRequired,
        editSensor: React.PropTypes.func.isRequired,
        navigateTo: React.PropTypes.func,
        params: React.PropTypes.object,
        sensors: React.PropTypes.array.isRequired
    },
    getAddForm: function () {
        return (
            <SensorForm
                navigateTo={this.props.navigateTo}
                onSave={this.props.addSensor}
            />
        );
    },
    getEditForm: function () {
        return (
            <SensorForm
                id={parseInt(this.props.params.id)}
                initialValues={this.getSensorFields()}
                navigateTo={this.props.navigateTo}
                onSave={this.props.editSensor}
            />
        );
    },
    getSensorFields: function () {
        return R.find(R.propEq("id", parseInt(this.props.params.id)))(this.props.sensors).fields;
    },
    render: function () {
        return (
            <div>
                {this.props.params.id ? this.getEditForm() : this.getAddForm()}
            </div>
        );
    }
});

module.exports = connect(mapStateToProps, mapDispatchToProps)(Sensor);