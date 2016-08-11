import R from "ramda";
import React, {PropTypes} from "react";
// import {DragSource} from "react-dnd";
import IPropTypes from "react-immutable-proptypes";
import Toggle from "react-toggle";

import {Button, Icon} from "components";

// import {Types} from "lib/dnd-utils";
import {defaultTheme} from "lib/theme";
import {getUsername, isActiveUser, isConfirmedUser} from "lib/users-utils";

const styles = ({colors}, marginLeft, open) => ({
    container: {
        borderBottom: "1px solid " + colors.borderSensorsTable,
        width: "100%",
        height: "50px",
        margin: "0px",
        padding: "0px",
        marginLeft: marginLeft + "px",
        display: "initial"
    },
    iconArrow: {
        lineHeight: "15px",
        verticalAlign: "text-top",
        marginRight: "10px",
        display: "inline-block",
        transform: open ? "rotate(180deg)" : null
    }
});

var UserRow = React.createClass({
    propTypes: {
        children: IPropTypes.map,
        connectDragSource: PropTypes.func,
        indent: PropTypes.bool,
        isDragging: PropTypes.bool,
        user: IPropTypes.map.isRequired
    },
    contextTypes: {
        theme: PropTypes.object
    },
    getInitialState: function () {
        return {
            childrenOpen: false
        };
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    renderUser: function (theme) {
        return isConfirmedUser(this.props.user) ? this.renderRegistered(theme) : this.renderUnregistered(theme);
    },
    renderChildrenButton: function (theme) {
        const isOpen = this.state.childrenOpen;
        return this.props.children && this.props.children.size > 0 ? (
            <Button
                onClick={() => this.setState({childrenOpen: !isOpen})}
                style={{
                    backgroundColor: theme.colors.transparent,
                    border: "0px",
                    color: theme.colors.mainFontColor,
                    boxShadow: "none",
                    minWidth: "auto",
                    textAlign: "left"
                }}
            >
                <Icon
                    color={theme.colors.mainFontColor}
                    icon={"arrow-down"}
                    size={"14px"}
                    style={styles(theme, 0, isOpen).iconArrow}
                />
            </Button>
        ) : null;
    },
    renderChildren: function () {
        return this.state.childrenOpen ? (
            <UserRow
                indent={true}
                user={this.props.children.first()}
            />
        ) : null;
    },
    renderRegistered: function (theme) {
        return (
            <div style={{color: theme.colors.white, display: "inline"}}>
                <label style={{width: "40%"}}>
                    {getUsername(this.props.user)}
                </label>
                <label style={{width: "50%"}}>
                    {!R.isNil(this.props.user.get("roles")) ? this.props.user.get("roles").join(", ") : ""}
                </label>
                <Toggle defaultChecked={isActiveUser(this.props.user)} />
                {this.renderChildrenButton(theme)}
                {this.renderChildren()}
            </div>
        );
    },
    renderUnregistered: function (theme) {
        return (
            <div style={{color: theme.colors.greySubTitle, display: "inline"}}>
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
        // const {connectDragSource, indent} = this.props;
        const {indent} = this.props;
        // return connectDragSource(
        return (
            <div style={styles(theme, indent ? 100 : 0).container}>
                {this.renderUser(theme)}
            </div>
        );
    }
});

// const userSource = {
//     beginDrag () {
//         return {
//             type: Types.USER_ROW
//         };
//     }
// };
//
// function collect (connect, monitor) {
//     return {
//         connectDragSource: connect.dragSource(),
//         isDragging: monitor.isDragging()
//     };
// }

//TODO module.exports = DragSource(Types.USER_ROW, userSource, collect)(UserRow);
module.exports = UserRow;