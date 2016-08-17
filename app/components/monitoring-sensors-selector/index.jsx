import React, {PropTypes} from "react";
import IPropTypes from "react-immutable-proptypes";

import {
    MonitoringSearch,
    MonitoringWorkArea
} from "components";

var MonitoringSensorsSelector = React.createClass({
    propTypes: {
        addSensorToWorkArea: PropTypes.func.isRequired,
        filterSensors: PropTypes.func.isRequired,
        filters: PropTypes.object,
        onClickAggregate: PropTypes.func,
        removeSensorFromWorkArea: PropTypes.func.isRequired,
        selectSensor: PropTypes.func.isRequired,
        selectSensorsToDraw: PropTypes.func.isRequired,
        selectedSensors: PropTypes.array,
        sensors: IPropTypes.map.isRequired,
        workAreaSensors: PropTypes.array
    },
    render: function () {
        return (
            <div>
                <MonitoringSearch
                    filterSensors={this.props.filterSensors}
                    style={{width: "25%", float: "left", marginTop: "2px", height: "calc(100vh - 120px)"}}
                />
                <MonitoringWorkArea
                    addSensorToWorkArea={this.props.addSensorToWorkArea}
                    filters={this.props.filters}
                    onClickAggregate={this.props.onClickAggregate}
                    removeSensorFromWorkArea={this.props.removeSensorFromWorkArea}
                    selectSensor={this.props.selectSensor}
                    selectSensorsToDraw={this.props.selectSensorsToDraw}
                    selected={this.props.selectedSensors}
                    sensors={this.props.sensors}
                    workAreaSensors={this.props.workAreaSensors}
                />
            </div>
        );
    }
});

module.exports = MonitoringSensorsSelector;