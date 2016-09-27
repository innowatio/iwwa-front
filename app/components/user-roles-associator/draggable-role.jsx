import React, {PropTypes} from "react";
import {DragSource} from "react-dnd";
import IPropTypes from "react-immutable-proptypes";
import {defaultTheme} from "lib/theme";

import {Types} from "lib/dnd-utils";

var DraggableRole = React.createClass({
    propTypes: {
        connectDragSource: PropTypes.func,
        role: IPropTypes.map.isRequired
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    render: function () {
        const {colors} = this.getTheme();
        const {connectDragSource, role} = this.props;
        return connectDragSource(
            <div style={{
                padding: "2px 10px",
                border: "1px solid " + colors.white,
                borderRadius: "30px",
                marginBottom: "8px",
                float: "left",
                display: "block",
                width: "auto",
                clear: "both",
                cursor: "pointer"
            }}>
                {role.get("name")}
            </div>
        );
    }
});

const roleSource = {
    beginDrag (props) {
        return {
            role: props.role.get("name"),
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
