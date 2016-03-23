import React, {PropTypes} from "react";
import {DragSource} from "react-dnd";
import {DnDItemTypes} from "lib/constants";

const sensorRowSource = {
    beginDrag (props) {
        return {id: props.sensorId};
    },

    endDrag (props, monitor) {
        if (!monitor.didDrop()) {
            return;
        }

        // When dropped on a compatible target, do something
        const item = monitor.getItem();
        //const dropResult = monitor.getDropResult();
        console.log("dragged " + item.id);
    }
};

function collect (connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    };
}

var SensorRow = React.createClass({
    propTypes: {
        connectDragSource: PropTypes.func,
        id: PropTypes.string,
        isDragging: PropTypes.bool,
        sensorId: PropTypes.string
    },
    render () {
        // Your component receives its own props as usual
        const {id} = this.props;

        // These two props are injected by React DnD,
        // as defined by your `collect` function above:
        const {isDragging, connectDragSource} = this.props;

        return connectDragSource(
            <div>
                {"I am a draggable card number " + id}
                {isDragging && " (and I am being dragged now)"}
            </div>
        );
    }
});

module.exports =  DragSource(DnDItemTypes.SENSOR, sensorRowSource, collect)(SensorRow);