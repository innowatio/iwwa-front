import React, {PropTypes} from "react";
import {DragSource} from "react-dnd";
import {defaultTheme} from "lib/theme";

import {Types} from "lib/dnd-utils";

var DraggableRole = React.createClass({
    propTypes: {
        connectDragSource: PropTypes.func,
        roleName: PropTypes.string.isRequired
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    render: function () {
        const {colors} = this.getTheme();
        const {connectDragSource, roleName} = this.props;
        return connectDragSource(
            <div style={{
                padding: "2px 10px",
                border: "1px solid " + colors.mainFontColor,
                borderRadius: "30px",
                marginBottom: "8px",
                float: "left",
                display: "block",
                width: "auto",
                clear: "both",
                cursor: "pointer"
            }}>
                {roleName}
            </div>
        );
    }
});

const roleSource = {
    beginDrag (props) {
        return {
            role: props.roleName,
            type: Types.ROLE
        };
    }
};

function collect (connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    };
}

module.exports = DragSource(Types.ROLE, roleSource, collect)(DraggableRole);
