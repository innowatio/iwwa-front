import React, {PropTypes} from "react";
import {DragSource} from "react-dnd";

import {Types} from "lib/dnd-utils";
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
            <label style={{color: theme.colors.navText, textAlign: "left", border: "1px solid", borderRadius: "10px", padding: "7px", display: "inherit"}}>
                {(sensor.get("name") ? sensor.get("name") : sensor.get("_id")) + " - " + sensor.get("description")}
            </label>
        );
    }
});

module.exports = DragSource(Types.SENSOR, sensorSource, collect)(DraggableSensor);