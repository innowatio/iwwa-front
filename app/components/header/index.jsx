import React, {PropTypes} from "react";
import {Link} from "react-router";
import {merge, prop} from "ramda";

import {defaultTheme} from "lib/theme";
import components from "components";
import {isAdmin} from "lib/roles-utils";
import {EXEC_ENV} from "lib/config";

var stylesFunction = ({colors}) => ({
    base: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px",
        background: colors.primary,
        height: "100%",
        color: colors.white
    },
    icon: {
        cursor: "pointer",
        alignItems: "center"
    },
    hamburger: {
        cursor: "pointer"
    },
    viewTitle: {
        margin: "auto",
        fontSize: "20px",
        borderBottom: `3px solid ${colors.buttonPrimary}`
    }
});

var Header = React.createClass({
    propTypes: {
        asteroid: PropTypes.object.isRequired,
        isAuthorizedUser: PropTypes.bool.isRequired,
        logout: PropTypes.func.isRequired,
        menuClickAction: PropTypes.func,
        selectThemeColor: PropTypes.func,
        title: PropTypes.string,
        userSetting: PropTypes.object
    },
    contextTypes: {
        theme: PropTypes.object
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    getUserSettings: function () {
        return [
            {label: "Tema scuro", key: "dark"},
            {label: "Tema chiaro", key: "light"}
        ];
    },
    renderUserSetting: function () {
        const userSetting = this.getUserSettings().find(userSetting => {
            return this.props.userSetting.theme.color === userSetting.key;
        });
        return this.props.isAuthorizedUser ? (
            <components.Popover
                arrowColor={this.getTheme().colors.backgroundArrowPopover}
                hideOnChange={true}
                title={
                    <components.Icon
                        color={this.getTheme().colors.iconHeader}
                        icon={"settings"}
                        size={"30px"}
                        style={{lineHeight: "20px", verticalAlign: "middle"}}
                    />}
            >
                <components.DropdownSelect
                    allowedValues={this.getUserSettings()}
                    getColor={prop("color")}
                    getKey={prop("key")}
                    getLabel={prop("label")}
                    onChange={this.props.selectThemeColor}
                    style={{float: "left"}}
                    value={userSetting}
                />
            </components.Popover>
        ) : null;
    },
    renderAdminPage: function () {
        return isAdmin(this.props.asteroid) && EXEC_ENV !== "cordova" ? (
            <span style={{marginRight: "15px"}}>
                <Link to="/users/" >
                    <components.Icon
                        color={this.getTheme().colors.iconHeader}
                        icon={"user"}
                        size={"30px"}
                        style={{lineHeight: "20px", verticalAlign: "top"}}
                    />
                </Link>
            </span>
        ) : null;
    },
    renderInboxPage: function () {
        return this.props.isAuthorizedUser ? (
            <div style={{marginRight: "15px"}}>
                <Link to="" >
                    <components.Icon
                        color={this.getTheme().colors.iconHeader}
                        icon={"box"}
                        size={"30px"}
                        style={{lineHeight: "20px", verticalAlign: "middle"}}
                    />
                </Link>
            </div>
        ) : null;
    },
    renderAlarmPage: function () {
        return this.props.isAuthorizedUser ? (
            <div style={{marginRight: "15px"}}>
                <Link to="" >
                    <components.Icon
                        color={this.getTheme().colors.iconHeader}
                        icon={"danger"}
                        size={"28px"}
                        style={{lineHeight: "20px", verticalAlign: "top"}}
                    />
                </Link>
            </div>
        ) : null;
    },
    renderMenu: function () {
        return this.props.isAuthorizedUser ? (
            <components.Icon
                color={this.getTheme().colors.white}
                icon={"menu"}
                onClick={this.props.menuClickAction}
                size={"46px"}
                style={{lineHeight: "20px"}}
            />
        ) : null;
    },
    render: function () {
        const styles = stylesFunction(this.getTheme());
        return (
            <div style={styles.base}>
                {this.renderMenu()}
                <span style={merge(styles.base, {marginLeft: "15px"})}>
                    <Link to="/" >
                        <components.Icon
                            color={this.getTheme().colors.iconHeader}
                            icon={"innowatio-logo"}
                            size={"40px"}
                            style={{lineHeight: "20px"}}
                        />
                    </Link>
                </span>
                <div style={styles.viewTitle}>
                    {this.props.title.toUpperCase()}
                </div>
                {this.renderUserSetting()}
                {this.renderAdminPage()}
                {this.renderInboxPage()}
                {this.renderAlarmPage()}
                <span onClick={this.props.logout} style={styles.icon}>
                    <components.Icon
                        color={this.getTheme().colors.iconHeader}
                        icon={"logout"}
                        size={"30px"}
                        style={{lineHeight: "20px", verticalAlign: "middle"}}
                    />
                </span>
            </div>
        );
    }
});

module.exports = Header;
