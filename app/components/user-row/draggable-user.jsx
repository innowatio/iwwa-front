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
        display: "inline-block",
        lineHeight: "10px",
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
                    float: "right",
                    backgroundColor: theme.colors.backgroundUserButton,
                    border: "0px",
                    borderRadius: "100%",
                    color: theme.colors.mainFontColor,
                    textAlign: "center",
                    lineHeight: "30px",
                    width: "26px",
                    height: "26px",
                    padding: "0px",
                    marginTop: "4px",
                    marginLeft: "10px"
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
                        {!R.isNil(user.get("groups")) ? user.get("groups").join(", ") : ""}
                    </label>
                </div>
                <div className="toggle" style={{display: "inline-block", paddingTop: "9px"}}>
                    <Toggle
                        defaultChecked={isActiveUser(user)}
                        onChange={() => this.props.onChangeActiveStatus(user)}
                    />
                    <Style
                        rules={{
                            ".react-toggle-track":{
                                backgroundColor: theme.colors.backgroundToggleButton,
                                border: "1px solid " + theme.colors.backgroundUserButton,
                                padding: "4px !important"
                            },
                            ".react-toggle:hover .react-toggle-track": {
                                backgroundColor: theme.colors.backgroundToggleButton
                            },
                            ".react-toggle-track-x, .react-toggle-track-check": {
                                display: "none"
                            },
                            ".react-toggle-thumb": {
                                backgroundColor: theme.colors.backgroundUnregisteredUser,
                                width: "16px",
                                height: "16px",
                                top: "4px",
                                left: "4px",
                                border: "none",
                                borderColor: theme.colors.transparent
                            },

                            ".react-toggle--checked .react-toggle-thumb": {
                                backgroundColor: theme.colors.backgroundRegisteredUser,
                                left: "30px"
                            },
                            ".react-toggle--focus .react-toggle-thumb, .react-toggle:active .react-toggle-thumb": {
                                WebkitBoxShadow: "0px !important",
                                MozBoxShadow: "0px !important",
                                BoxShadow: "0px !important"
                            },
                            ".react-toggle:focus .react-toggle-thumb": {
                                WebkitBoxShadow: "0px !important",
                                MozBoxShadow: "0px !important",
                                BoxShadow: "0px !important"
                            }
                        }}
                        scopeSelector={".toggle"}
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
