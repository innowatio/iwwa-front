import {Style} from "radium";
import R from "ramda";
import React, {PropTypes} from "react";
import {DragSource} from "react-dnd";
import IPropTypes from "react-immutable-proptypes";
import Toggle from "react-toggle";

import {Button, Icon} from "components";
import UserDropArea from "./user-drop-area";

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
    },
    usernameStyles: {
        borderLeft: open ? "2px solid " + colors.buttonPrimary : "2px solid " + colors.white,
        color: open ? colors.buttonPrimary : colors.white
    },
    groupsStyles: {
        color: open ? colors.buttonPrimary : colors.white
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
        moveUser: PropTypes.func,
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
                    marginTop: "6px",
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
        const marginLeft = indent + "%";
        let rowStyle = {};
        if (isSelected(user.get("_id"))) {
            rowStyle = {
                backgroundColor: theme.colors.buttonPrimary,
                color: theme.colors.white
            };
        }
        return connectDragSource(
            <div>
                <div style={{
                    display: "block",
                    float: "left",
                    backgroundColor: theme.colors.backgroundUsersTable,
                    width: marginLeft,
                    height: "50px"
                }}>
                </div>
                <UserDropArea
                    changeParent={this.props.moveUser}
                    className="registered-user"
                    style={rowStyle}
                    user={this.props.user}
                >
                    <Style
                        rules={{".registered-user:hover": hoverStyle(theme)}}
                    />
                    <div onClick={() => this.props.onSelect(user)}>
                        <div style={{
                            width: `calc(50% - ${marginLeft})`,
                            cursor: "inherit",
                            float: "left",
                            borderLeft: "2px solid " + theme.colors.white,
                            paddingLeft: "10px",
                            marginBottom: "0px",
                            ...styles(theme, this.props.isChildrenOpen).usernameStyles,
                            ...rowStyle
                        }}>
                            {getUsername(user)}
                        </div>
                        <div style={{
                            cursor: "inherit",
                            width: "30%",
                            height: "50px",
                            margin: "0px",
                            float: "left",
                            ...styles(theme, this.props.isChildrenOpen).groupsStyles,
                            ...rowStyle
                        }}>
                            {!R.isNil(user.get("groups")) ? user.get("groups").join(", ") : ""}
                        </div>
                    </div>
                    <div className="toggle" style={{height: "50px", padding: "6px"}}>
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
                                ".react-toggle--focus .react-toggle-thumb": {
                                    outline: "none !important",
                                    WebkitBoxShadow: "none !important",
                                    MozBoxShadow: "none !important",
                                    BoxShadow: "none !important"
                                },
                                ".react-toggle--focus": {
                                    outline: "none !important",
                                    WebkitBoxShadow: "none !important",
                                    MozBoxShadow: "none !important",
                                    BoxShadow: "none !important"
                                }
                            }}
                            scopeSelector={".toggle"}
                        />
                        {this.renderChildrenButton(theme)}
                    </div>
                </UserDropArea>
            </div>
        );
    }
});

const userSource = {
    beginDrag (props) {
        return {
            type: Types.USER_ROW,
            user: props.user
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
