import {Style} from "radium";
import R from "ramda";
import React, {PropTypes} from "react";
// import {DragSource} from "react-dnd";
import IPropTypes from "react-immutable-proptypes";
import Toggle from "react-toggle";

import {Button, Icon} from "components";

// import {Types} from "lib/dnd-utils";
import {defaultTheme} from "lib/theme";
import {getUsername, isActiveUser, isConfirmedUser} from "lib/users-utils";

const hoverStyle = ({colors}) => ({
    backgroundColor: colors.backgroundMonitoringRowHover,
    cursor: "pointer"
});

const styles = ({colors}, open) => ({
    container: {
        borderBottom: "1px solid " + colors.borderSensorsTable,
        width: "100%",
        height: "50px",
        margin: "0px",
        padding: "0px",
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
        connectDragSource: PropTypes.func,
        getChildren: PropTypes.func,
        indent: PropTypes.number.isRequired,
        isDragging: PropTypes.bool,
        isSelected: PropTypes.func,
        onSelect: PropTypes.func,
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
    renderChildrenButton: function (children, theme) {
        const isOpen = this.state.childrenOpen;
        return children && children.size > 0 ? (
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
                    style={styles(theme, isOpen).iconArrow}
                />
            </Button>
        ) : null;
    },
    renderChildren: function (children) {
        return this.state.childrenOpen ? (
            <UserRow
                getChildren={this.props.getChildren}
                indent={this.props.indent + 10}
                isSelected={this.props.isSelected}
                onSelect={this.props.onSelect}
                user={children.first()}
            />
        ) : null;
    },
    renderRegistered: function (theme) {
        const children = this.props.getChildren(this.props.user.get("_id"));
        return (
            <div style={{color: theme.colors.white}}>
                <div className="registered-user" onClick={() => this.props.onSelect(this.props.user)} style={{display: "inline-block", width: "90%"}}>
                    <Style
                        rules={{".registered-user:hover": hoverStyle(theme)}}
                    />
                    <label style={{width: this.props.indent + "%"}} />
                    <label style={{cursor: "inherit", width: (70 - this.props.indent) + "%"}}>
                        {getUsername(this.props.user)}
                    </label>
                    <label style={{cursor: "inherit", width: "30%"}}>
                        {!R.isNil(this.props.user.get("roles")) ? this.props.user.get("roles").join(", ") : ""}
                    </label>
                </div>
                <div style={{display: "inline"}}>
                    <Toggle defaultChecked={isActiveUser(this.props.user)} />
                    {this.renderChildrenButton(children, theme)}
                </div>
                {this.renderChildren(children)}
            </div>
        );
    },
    renderUnregistered: function (theme) {
        return (
            <div style={{color: theme.colors.greySubTitle}}>
                <label style={{width: this.props.indent + "%"}} />
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
        // const {connectDragSource} = this.props;
        // return connectDragSource(
        return (
            <div style={styles(theme).container}>
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