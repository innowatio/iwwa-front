import React, {PropTypes} from "react";
import {DragSource} from "react-dnd";

import {Types} from "lib/dnd-utils";
import {defaultTheme} from "lib/theme";

import {Icon} from "components";

const sensorSource = {
    beginDrag (props) {
        return {
            operator: props.type,
            type: Types.OPERATOR    
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

var DraggableOperator = React.createClass({
    propTypes: {
        connectDragSource: PropTypes.func,
        isDragging: PropTypes.bool,
        type: PropTypes.string
    },
    contextTypes: {
        theme: PropTypes.object
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    render () {
        const {type, connectDragSource} = this.props;
        let theme = this.getTheme();
        return connectDragSource(
            <div style={{width: "40px", height: "40px", display: "inline-block", margin: "5px"}}>
                <Icon
                    color={theme.colors.iconHeader}
                    icon={type}
                    size={"40px"}
                    style={{lineHeight: "20px", width: "40px", height: "40px", borderRadius: "100%", background: "green"}}
                />
            </div>
        );
    }
});

module.exports = DragSource(Types.OPERATOR, sensorSource, collect)(DraggableOperator);