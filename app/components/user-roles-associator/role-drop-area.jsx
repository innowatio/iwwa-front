import React, {PropTypes} from "react";
import {DropTarget} from "react-dnd";

import {Types} from "lib/dnd-utils";

var RoleDropArea = React.createClass({
    propTypes: {
        addRole: PropTypes.func.isRequired,
        connectDropTarget: PropTypes.func,
        roles: PropTypes.array.isRequired
    },
    render: function () {
        const {connectDropTarget, roles} = this.props;
        return connectDropTarget(
            <div style={{minHeight: "300px"}}>
                {roles.map(role => (
                    <div>
                        {role}
                    </div>
                ))}
            </div>
        );
    }
});

const roleTarget = {
    drop (props, monitor) {
        const item = monitor.getItem();
        if (props.roles.indexOf(item.role) < 0) {
            props.addRole(item.role);
        }
        return {moved: true};
    }
};

function collect (connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        itemType: monitor.getItemType()
    };
}

module.exports = DropTarget(Types.ROLE, roleTarget, collect)(RoleDropArea);