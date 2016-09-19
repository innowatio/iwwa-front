import React, {PropTypes} from "react";
import {DragSource} from "react-dnd";
import IPropTypes from "react-immutable-proptypes";

import {Types} from "lib/dnd-utils";

var DraggableRole = React.createClass({
    propTypes: {
        connectDragSource: PropTypes.func,
        role: IPropTypes.map.isRequired
    },
    render: function () {
        const {connectDragSource, role} = this.props;
        return connectDragSource(
            <div>
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