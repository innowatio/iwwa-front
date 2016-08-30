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
        onClickAggregate: PropTypes.func,
        removeSensorFromWorkArea: PropTypes.func.isRequired,
        searchButton: PropTypes.object,
        selectSensor: PropTypes.func,
        selectSensorsToDraw: PropTypes.func,
        selectedSensors: PropTypes.array,
        sensors: IPropTypes.map.isRequired,
        sensorsState: PropTypes.object,
        tableInstructions: PropTypes.string,
        workAreaInstructions: PropTypes.string,
        workAreaMessage: PropTypes.string,
        workAreaOldSensors: IPropTypes.list
    },
    render: function () {
        const {workAreaSensors} = this.props.sensorsState;
        return (
            <div>
                <MonitoringSearch
                    filterSensors={this.props.filterSensors}
                    searchButton={this.props.searchButton}
                    style={{width: "25%", float: "left", marginTop: "2px", height: "calc(100vh - 120px)"}}
                />
                <MonitoringWorkArea
                    addSensorToWorkArea={this.props.addSensorToWorkArea}
                    filters={this.props.sensorsState}
                    onClickAggregate={this.props.onClickAggregate}
                    removeSensorFromWorkArea={this.props.removeSensorFromWorkArea}
                    selectSensor={this.props.selectSensor}
                    selectSensorsToDraw={this.props.selectSensorsToDraw}
                    selected={this.props.selectedSensors}
                    sensors={this.props.sensors}
                    tableInstructions={this.props.tableInstructions}
                    workAreaInstructions={this.props.workAreaInstructions}
                    workAreaMessage={this.props.workAreaMessage}
                    workAreaOldSensors={this.props.workAreaOldSensors}
                    workAreaSensors={workAreaSensors}
                />
            </div>
        );
    }
});

module.exports = MonitoringSensorsSelector;