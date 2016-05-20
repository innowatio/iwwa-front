import React, {PropTypes} from "react";
import {DragSource} from "react-dnd";

import {Types} from "lib/dnd-utils";
import {getSensorLabel} from "lib/sensors-utils";
import {defaultTheme} from "lib/theme";

const sensorSource = {
    beginDrag (props) {
        return {
            sensor: props.sensor,
            type: Types.SENSOR
        };
    },

    endDrag (props, monitor) {
        if (!monitor.didDrop()) {
            return;
        }
        // TODO When dropped on a compatible target, do something
    }
};

function collect (connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    };
}

var DraggableSensor = React.createClass({
    propTypes: {
        connectDragSource: PropTypes.func,
        isDragging: PropTypes.bool,
        key: PropTypes.string,
        sensor: PropTypes.object
    },
    contextTypes: {
        theme: PropTypes.object
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    render () {
        const {connectDragSource, sensor} = this.props;
        let theme = this.getTheme();
        return connectDragSource(
            <label style={{
                height: "44px",
                lineHeight: "44px",
                padding: "0px 10px",
                color: theme.colors.white,
                backgroundColor: theme.colors.backgroundContentModal,
                cursor: "pointer",
                textAlign: "left",
                border: "1px solid",
                borderRadius: "10px",
                display: "inherit"
            }}
            >
                {sensor ? getSensorLabel(sensor) + " - " + sensor.get("description") : "undefined sensor"}
            </label>
        );
    }
});

module.exports = DragSource(Types.SENSOR, sensorSource, collect)(DraggableSensor);
