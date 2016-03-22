import React, {PropTypes} from "react";
import {DragSource} from 'react-dnd';

import {Types} from 'lib/dnd-utils';
import {defaultTheme} from "lib/theme";

const sensorSource = {
    beginDrag(props) {
        const item = { id: props.id };
        return item;
    },

    endDrag(props, monitor, component) {
        if (!monitor.didDrop()) {
            return;
        }
        // TODO When dropped on a compatible target, do something
    }
};

function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    };
}

var DraggableSensor = React.createClass({
    propTypes: {
        id: PropTypes.string
    },
    contextTypes: {
        theme: PropTypes.object
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    render () {
        const {id, isDragging, connectDragSource} = this.props;
        let theme = this.getTheme();

        return connectDragSource(
            <label style={{color: theme.colors.navText}}>
                {id}
                {isDragging && ' (dragging)'}
            </label>
        );
    }
});

module.exports = DragSource(Types.SENSOR, sensorSource, collect)(DraggableSensor);