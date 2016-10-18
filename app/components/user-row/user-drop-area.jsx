import React, {PropTypes} from "react";
import {DropTarget} from "react-dnd";
import IPropTypes from "react-immutable-proptypes";

import {Types} from "lib/dnd-utils";
import {hasRole, MANAGE_USERS} from "lib/roles-utils";
import {defaultTheme} from "lib/theme";
import {hasParentPermissions} from "lib/users-utils";

var UserDropArea = React.createClass({
    propTypes: {
        asteroid: PropTypes.object,
        changeParent: PropTypes.func.isRequired,
        children: PropTypes.element,
        className: PropTypes.string,
        connectDropTarget: PropTypes.func,
        onClick: PropTypes.func,
        style: PropTypes.object,
        user: IPropTypes.map.isRequired
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    render: function () {
        const {children, className, connectDropTarget, onClick, style} = this.props;
        return connectDropTarget(
            <div className={className} style={style} onClick={onClick}>
                {children}
            </div>
        );
    }
});

const userTarget = {
    canDrop (props, monitor) {
        const item = monitor.getItem();
        return item.user.get("_id") !== props.user.get("_id") && hasRole(props.asteroid, MANAGE_USERS);
    },
    drop (props, monitor) {
        const item = monitor.getItem();
        if (hasParentPermissions(item.user, props.user, props.asteroid)) {
            props.changeParent(item.user, props.user.get("_id"));
            return {moved: true};
        } else {
            return {moved: false};
        }
    }
};

function collect (connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        itemType: monitor.getItemType()
    };
}

module.exports = DropTarget(Types.USER_ROW, userTarget, collect)(UserDropArea);
