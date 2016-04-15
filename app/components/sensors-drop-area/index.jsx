import React, {PropTypes} from "react";
import {DropTarget} from "react-dnd";

import {Types} from "lib/dnd-utils";
import {defaultTheme} from "lib/theme";

const sensorsTarget = {
    drop (props, monitor) {
        const item = monitor.getItem();
        props.addSensorToWorkArea(item);
        return {moved: true};
    }
};

function collect (connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        itemType: monitor.getItemType()
    };
}

var SensorsDropArea = React.createClass({
    propTypes: {
        addSensorToWorkArea: PropTypes.func.isRequired,
        connectDropTarget: PropTypes.func,
        sensors: PropTypes.array.isRequired
    },
    contextTypes: {
        theme: PropTypes.object
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    renderMessage: function (theme) {
        return (
            <label style={{width: "100%", color: theme.colors.navText, textAlign: "center"}}>
                {"Trascina in questo spazio i sensori che vuoi graficare"}
            </label>
        );
    },
    renderSensors: function () {
        let sensors = [];
        this.props.sensors.forEach((el) => {
            sensors.push(
                <div>
                    {"prova: " + el}
                </div>
            );
        });
        return sensors;
    },
    render: function () {
        const theme = this.getTheme();
        const {connectDropTarget} = this.props;
        return connectDropTarget(
            <div style={{
                border: "1px solid " + theme.colors.borderContentModal,
                borderRadius: "20px",
                background: theme.colors.backgroundContentModal,
                marginTop: "40px",
                minHeight: "200px",
                overflow: "auto",
                padding: "20px 10px",
                verticalAlign: "middle"
            }}
            >
                {this.props.sensors.length > 0 ? this.renderSensors() : this.renderMessage(theme)}
            </div>
        );
    }
});

module.exports = DropTarget([Types.SENSOR_ROW], sensorsTarget, collect)(SensorsDropArea);