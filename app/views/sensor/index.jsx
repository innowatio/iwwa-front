import R from 'ramda'
import React from 'react'
import { connect } from 'react-redux'
import { routeActions } from 'react-router-redux'
import { bindActionCreators } from 'redux';
import { editSensor, addSensor } from 'actions/sensors'
import SensorForm from 'components/sensor-form/'

const mapStateToProps = (state) => {
    return {
        sensors: state.sensors.allSensors
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        editSensor: bindActionCreators(editSensor, dispatch),
        addSensor: bindActionCreators(addSensor, dispatch),
        navigateTo: (path) => dispatch(routeActions.push(path))
    };
};

var Sensor = React.createClass({
    getAddForm: function() {
        return (
            <SensorForm
                onSave={this.props.addSensor}
                navigateTo={this.props.navigateTo}
            />
        );
    },
    getEditForm: function() {
        return (
            <SensorForm
                initialValues={this.getSensorFields()}
                onSave={this.props.editSensor}
                navigateTo={this.props.navigateTo}
                id={parseInt(this.props.params.id)}
            />
        );
    },
    getSensorFields: function() {
        return R.find(R.propEq('id', parseInt(this.props.params.id)))(this.props.sensors).fields;
    },
    render: function() {
        return (
            <div>
                {this.props.params.id ? this.getEditForm() : this.getAddForm()}
            </div>
        );
    }
});

module.exports = connect(mapStateToProps, mapDispatchToProps)(Sensor);