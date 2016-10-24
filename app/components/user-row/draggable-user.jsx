import {Style} from "radium";
import R from "ramda";
import React, {PropTypes} from "react";
import {DragSource} from "react-dnd";
import IPropTypes from "react-immutable-proptypes";
import Toggle from "react-toggle";

import {Button, Icon} from "components";
import UserDropArea from "./user-drop-area";

import {Types} from "lib/dnd-utils";
import {hasRole, MANAGE_USERS} from "lib/roles-utils";
import {defaultTheme} from "lib/theme";
import {getUsername, isActiveUser} from "lib/users-utils";

const hoverStyle = ({colors}) => ({
    backgroundColor: colors.backgroundMonitoringRowHover,
    cursor: "pointer"
});

function getColor (colors, open, confirmed, prepend) {
    return prepend + (open ? colors.buttonPrimary : (confirmed ? colors.white : colors.greySubTitle));
}

const styles = ({colors}, open, confirmed) => ({
    iconArrow: {
        display: "inline-block",
        lineHeight: "10px",
        transform: open ? "rotate(180deg)" : null
    },
    usernameStyles: {
        borderLeft: getColor(colors, open, confirmed, "2px solid "),
        color: getColor(colors, open, confirmed, "")
    },
    groupsStyles: {
        color: getColor(colors, open, confirmed, "")
    }
});

var DraggableUser = React.createClass({
    propTypes: {
        asteroid: PropTypes.object,
        connectDragSource: PropTypes.func,
        hasChildren: PropTypes.bool,
        indent: PropTypes.number.isRequired,
        isChildrenOpen: PropTypes.bool,
        isConfirmed: PropTypes.bool,
        isDragging: PropTypes.bool,
        isSelected: PropTypes.func,
        isSelectedToClone: PropTypes.func,
        moveUser: PropTypes.func,
        onChangeActiveStatus: PropTypes.func,
        onOpenChildren: PropTypes.func,
        onSelect: PropTypes.func,
        showDragAlarm: PropTypes.func,
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
                onClick={(event) => {
                    this.props.onOpenChildren();
                    event.stopPropagation();
                }}
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
                    style={styles(theme, this.props.isChildrenOpen, this.props.isConfirmed).iconArrow}
                />
            </Button>
        ) : null;
    },
    renderUserName: function (theme, rowStyle, marginLeft) {
        let nameStyle = {
            width: `calc(50% - ${marginLeft})`,
            cursor: "inherit",
            float: "left",
            borderLeft: "2px solid " + theme.colors.white,
            marginBottom: "0px",
            paddingLeft: "10px",
            ...styles(theme, this.props.isChildrenOpen, this.props.isConfirmed).usernameStyles,
            ...rowStyle
        };
        return (
            <div style={nameStyle}>
                {!this.props.isConfirmed ?
                    <div style={{
                        display: "inline-block",
                        width: "28px",
                        height: "28px",
                        margin: "0px 10px",
                        border: "1px solid " + theme.colors.greySubTitle,
                        backgroundColor: theme.colors.backgroundUserIcon,
                        borderRadius: "100%",
                        textAlign: "center",
                        verticalAlign: "middle",
                        lineHeight: "28px"
                    }}>
                        <Icon
                            color={theme.colors.white}
                            icon={"danger"}
                            size={"16px"}
                        />
                    </div>
                : null}
                {getUsername(this.props.user)}
            </div>
        );
    },
    render: function () {
        const theme = this.getTheme();
        const {connectDragSource, indent, isSelected, isSelectedToClone, user} = this.props;
        const marginLeft = indent + "%";
        let rowStyle = {};
        if (isSelectedToClone(user.get("_id"))) {
            rowStyle = {
                backgroundColor: "lightpink",
                color: theme.colors.white
            };
        }
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
                    asteroid={this.props.asteroid}
                    changeParent={this.props.moveUser}
                    className="user-row"
                    onClick={() => this.props.onSelect(user)}
                    style={rowStyle}
                    user={this.props.user}
                >
                    <Style
                        rules={{".user-row:hover": hoverStyle(theme)}}
                    />
                    {this.renderUserName(theme, rowStyle, marginLeft)}
                    <div style={{
                        cursor: "inherit",
                        width: "30%",
                        height: "50px",
                        margin: "0px",
                        float: "left",
                        ...styles(theme, this.props.isChildrenOpen, this.props.isConfirmed).groupsStyles,
                        ...rowStyle
                    }}>
                        {!R.isNil(user.get("groups")) ? user.get("groups").join(", ") : ""}
                    </div>
                    <div className="toggle" style={{height: "50px", padding: "6px"}}>
                        <Toggle
                            disabled={!hasRole(this.props.asteroid, MANAGE_USERS)}
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
    },
    endDrag (props, monitor) {
        const result = monitor.getDropResult();
        if (result && !result.moved) {
            props.showDragAlarm();
        }
    }
};

function collect (connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    };
}

module.exports = DragSource(Types.USER_ROW, userSource, collect)(DraggableUser);
