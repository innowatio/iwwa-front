import R from "ramda";
import React, {PropTypes} from "react";
import {DragSource} from "react-dnd";
import IPropTypes from "react-immutable-proptypes";

import {Icon} from "components";

import {Types} from "lib/dnd-utils";
import {defaultTheme} from "lib/theme";
import {getUsername, isConfirmedUser} from "lib/users-utils";

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
        return isConfirmedUser(this.props.user) ? this.renderRegistered(theme) : this.renderUnregistered(theme);
    },
    renderRegistered: function (theme) {
        return (
            <div style={{color: theme.colors.white}}>
                <label style={{width: "30%"}}>
                    {getUsername(this.props.user)}
                </label>
                {!R.isNil(this.props.user.get("roles")) ? this.props.user.get("roles").join(", ") : ""}
            </div>
        );
    },
    renderUnregistered: function (theme) {
        return (
            <div style={{color: theme.colors.greySubTitle}}>
                <Icon
                    icon={"danger"}
                    size={"20px"}
                    style={{lineHeight: "20px", marginRight: "10px"}}
                />
                {getUsername(this.props.user)}
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