import {Style} from "radium";
import R from "ramda";
import React, {PropTypes} from "react";
import {DragSource} from "react-dnd";
import IPropTypes from "react-immutable-proptypes";
import Toggle from "react-toggle";

import {Button, Icon} from "components";

import {Types} from "lib/dnd-utils";
import {defaultTheme} from "lib/theme";
import {getUsername, isActiveUser} from "lib/users-utils";

const hoverStyle = ({colors}) => ({
    backgroundColor: colors.backgroundMonitoringRowHover,
    cursor: "pointer"
});

const styles = ({colors}, open) => ({
    iconArrow: {
        lineHeight: "15px",
        verticalAlign: "text-top",
        marginRight: "10px",
        display: "inline-block",
        transform: open ? "rotate(180deg)" : null
    }
});

var DraggableUser = React.createClass({
    propTypes: {
        connectDragSource: PropTypes.func,
        hasChildren: PropTypes.bool,
        indent: PropTypes.number.isRequired,
        isChildrenOpen: PropTypes.bool,
        isDragging: PropTypes.bool,
        isSelected: PropTypes.func,
        onChangeActiveStatus: PropTypes.func,
        onOpenChildren: PropTypes.func,
        onSelect: PropTypes.func,
        user: IPropTypes.map.isRequired
    },
    contextTypes: {
        theme: PropTypes.object
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    renderChildrenButton: function (theme) {
        return this.props.hasChildren ? (
            <Button
                onClick={this.props.onOpenChildren}
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
                    style={styles(theme, this.props.isChildrenOpen).iconArrow}
                />
            </Button>
        ) : null;
    },
    render: function () {
        const theme = this.getTheme();
        const {connectDragSource, indent, isSelected, user} = this.props;
        let rowStyle = {};
        if (isSelected(user.get("_id"))) {
            rowStyle = {
                backgroundColor: theme.colors.buttonPrimary
            };
        }
        return connectDragSource(
            <div className="registered-user" style={rowStyle}>
                <Style
                    rules={{".registered-user:hover": hoverStyle(theme)}}
                />
                <div onClick={() => this.props.onSelect(user)} style={{float: "left", width: "90%", paddingTop: "2px"}}>
                    <label style={{width: indent + "%"}} />
                    <label style={{cursor: "inherit", width: (70 - indent) + "%"}}>
                        {getUsername(user)}
                    </label>
                    <label style={{cursor: "inherit", width: "30%"}}>
                        {!R.isNil(user.get("roles")) ? user.get("roles").join(", ") : ""}
                    </label>
                </div>
                <div style={{display: "inline-block", paddingTop: "8px"}}>
                    <Toggle
                        defaultChecked={isActiveUser(user)}
                        onChange={() => this.props.onChangeActiveStatus(user)}
                    />
                    {this.renderChildrenButton(theme)}
                </div>
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

module.exports = DragSource(Types.USER_ROW, userSource, collect)(DraggableUser);
