import React, {PropTypes} from "react";
import {DropTarget} from "react-dnd";
import IPropTypes from "react-immutable-proptypes";

import {Types} from "lib/dnd-utils";
import {defaultTheme} from "lib/theme";

var UserDropArea = React.createClass({
    propTypes: {
        changeParent: PropTypes.func.isRequired,
        children: PropTypes.element,
        className: PropTypes.string,
        connectDropTarget: PropTypes.func,
        style: PropTypes.object,
        user: IPropTypes.map.isRequired
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    render: function () {
        const {children, className, connectDropTarget, style} = this.props;
        return connectDropTarget(
            <div className={className} style={style}>
                {children}
            </div>
        );
    }
});

const userTarget = {
    drop (props, monitor) {
        const item = monitor.getItem();
        props.changeParent(item.user, props.user.get("_id"));
        return {moved: true};
    }
};

function collect (connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        itemType: monitor.getItemType()
    };
}

module.exports = DropTarget(Types.USER_ROW, userTarget, collect)(UserDropArea);
