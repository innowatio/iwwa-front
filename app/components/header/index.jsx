import React, {PropTypes} from "react";
import {Map, List} from "immutable";
import {Link} from "react-router";
import {merge, prop} from "ramda";

import {defaultTheme} from "lib/theme";
import components from "components";

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
    logout: function () {
        this.props.asteroid.logout();
    },
    userIsAdmin: function () {
        const users = this.props.asteroid.collections.get("users") || Map();
        const roles = users.getIn([this.props.asteroid.userId, "roles"]) || List();
        return roles.includes("admin");
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
        return (
            <components.Popover
                arrowColor={this.getTheme().colors.white}
                hideOnChange={true}
                title={
                    <components.Icon
                        color={this.getTheme().colors.iconHeader}
                        icon={"settings"}
                        size={"30px"}
                        style={{lineHeight: "20px", verticalAlign: "middle"}}
                    />}
                tooltipId="tooltipUserSetting"
                tooltipMessage="Impostazioni dell'utente"
                tooltipPosition="left"
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
        );
    },
    renderAdminPage: function () {
        return this.userIsAdmin() && ENVIRONMENT !== "cordova" ? (
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
        return (
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
        );
    },
    renderAlarmPage: function () {
        return (
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
        );
    },
    render: function () {
        const styles = stylesFunction(this.getTheme());
        return (
            <div style={styles.base}>
                <components.Icon
                    color={this.getTheme().colors.white}
                    icon={"menu"}
                    onClick={this.props.menuClickAction}
                    size={"46px"}
                    style={{lineHeight: "20px"}}
                />
                <span style={merge(styles.base, {marginLeft: "15px"})}>
                    <Link to="/dashboard/" >
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
                <span onClick={this.logout} style={styles.icon}>
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
