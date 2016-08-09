import R from "ramda";
import React, {PropTypes} from "react";
import {DragSource} from "react-dnd";
import IPropTypes from "react-immutable-proptypes";

import {Types} from "lib/dnd-utils";
import {defaultTheme} from "lib/theme";

const styles = ({colors}) => ({
    container: {
        borderBottom: "1px solid " + colors.borderSensorsTable,
        width: "100%",
        height: "50px",
        margin: "0px",
        padding: "0px"
    }
});

var UserRow = React.createClass({
    propTypes: {
        connectDragSource: PropTypes.func,
        isDragging: PropTypes.bool,
        user: IPropTypes.map.isRequired
    },
    contextTypes: {
        theme: PropTypes.object
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    renderUser: function (theme) {
        return this.props.user.get("username") ? this.renderRegistered(theme) : this.renderUnregistered(theme);
    },
    renderRegistered: function () {
        return (
            <div>
                {this.props.user.get("username")}
                {this.props.user.getIn(["emails", "0", "address"])}
                {!R.isNil(this.props.user.get("roles")) ? this.props.user.get("roles").join(", ") : ""}
            </div>
        );
    },
    renderUnregistered: function () {
        return (
            <div>
                {this.props.user.getIn(["emails", "0", "address"])}
            </div>
        );
    },
    render: function () {
        const theme = this.getTheme();
        const {connectDragSource} = this.props;
        return connectDragSource(
            <div style={styles(theme).container}>
                {this.renderUser(theme)}
            </div>
        );
    }
});

const userSource = {
    beginDrag () {
        return {
            type: Types.USER_ROW
        };
    }
};

function collect (connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    };
}

module.exports = DragSource(Types.USER_ROW, userSource, collect)(UserRow);