import React, {PropTypes} from "react";
import {Link} from "react-router";
import {merge, prop} from "ramda";
import * as bootstrap from "react-bootstrap";

import {defaultTheme} from "lib/theme";
import components from "components";
import {canAccessUsers} from "lib/roles-utils";
import {EXEC_ENV} from "lib/config";

var styles = ({colors}) => ({
    base: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0px 8px",
        background: colors.primary,
        height: "100%",
        color: colors.white
    },
    iconWrp: {
        display: "block",
        lineHeight: "30px",
        backgroundColor: colors.transparent,
        cursor: "pointer"
    },
    icon: {
        lineHeight: "30px",
        verticalAlign: "middle"
    },
    hamburger: {
        cursor: "pointer"
    },
    viewTitle: {
        margin: "auto",
        fontSize: "20px",
        width: "100%",
        textAlign: "center"
    },
    textTitle: {
        overflow: "hidden",
        marginLeft: "115px",
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
        const theme = this.getTheme();
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
                        style={styles(theme).icon}
                    />}
                styleButton={{...styles(theme).iconWrp, margin: "0px 10px"}}
            >
                <components.DropdownSelect
                    allowedValues={this.getUserSettings()}
                    getColor={prop("color")}
                    getKey={prop("key")}
                    getLabel={prop("label")}
                    onChange={this.props.selectThemeColor}
                    style={{textAlign: "center"}}
                    value={userSetting}
                />
            </components.Popover>
        ) : null;
    },
    renderAdminPage: function () {
        const theme = this.getTheme();
        return (canAccessUsers(this.props.asteroid)) && EXEC_ENV !== "cordova" ? (
            <div style={{marginRight: "15px"}}>
                <bootstrap.OverlayTrigger
                    overlay={<bootstrap.Tooltip id="users" className="buttonInfo">
                        {"Gestione utenti"}
                    </bootstrap.Tooltip>}
                    placement="bottom"
                    rootClose={true}
                >
                    <Link to="/users/" style={styles(theme).iconWrp}>
                        <components.Icon
                            color={theme.colors.iconHeader}
                            icon={"user"}
                            size={"30px"}
                            style={styles(theme).icon}
                        />
                    </Link>
                </bootstrap.OverlayTrigger>
            </div>
        ) : null;
    },
    renderInboxPage: function () {
        const theme = this.getTheme();
        return this.props.isAuthorizedUser ? (
            <div style={{marginRight: "15px"}}>
                <bootstrap.OverlayTrigger
                    overlay={<bootstrap.Tooltip id="messages" className="buttonInfo">
                        {"Messaggi"}
                    </bootstrap.Tooltip>}
                    placement="bottom"
                    rootClose={true}
                >
                    <Link to="" style={styles(theme).iconWrp}>
                        <components.Icon
                            color={theme.colors.iconHeader}
                            icon={"box"}
                            size={"30px"}
                            style={styles(theme).icon}
                        />
                    </Link>
                </bootstrap.OverlayTrigger>
            </div>
        ) : null;
    },
    renderAlarmPage: function () {
        const theme = this.getTheme();
        return this.props.isAuthorizedUser ? (
            <div style={{marginRight: "15px"}}>
                <bootstrap.OverlayTrigger
                    overlay={<bootstrap.Tooltip id="alarms" className="buttonInfo">
                        {"Allarmi"}
                    </bootstrap.Tooltip>}
                    placement="bottom"
                    rootClose={true}
                >
                    <Link to="" style={styles(theme).iconWrp}>
                        <components.Icon
                            color={theme.colors.iconHeader}
                            icon={"danger"}
                            size={"28px"}
                            style={styles(theme).icon}
                        />
                    </Link>
                </bootstrap.OverlayTrigger>
            </div>
        ) : null;
    },
    renderMenu: function () {
        const theme = this.getTheme();
        return this.props.isAuthorizedUser ? (
            <components.Icon
                color={this.getTheme().colors.white}
                icon={"menu"}
                onClick={this.props.menuClickAction}
                size={"46px"}
                style={styles(theme).icon}
            />
        ) : null;
    },
    render: function () {
        const theme = this.getTheme();
        return (
            <div style={styles(theme).base}>
                {this.renderMenu()}
                <div style={merge(styles(theme).base, {marginLeft: "15px"})}>
                    <Link to="/" style={{...styles(theme).iconWrp, padding: "0px"}}>
                        <components.Icon
                            color={theme.colors.iconHeader}
                            icon={"innowatio-logo"}
                            size={"40px"}
                            style={styles(theme).icon}
                        />
                    </Link>
                </div>
                <div style={styles(theme).viewTitle}>
                    <text style={styles(theme).textTitle}>{this.props.title.toUpperCase()}</text>
                </div>
                {this.renderUserSetting()}
                {this.renderAdminPage()}
                {this.renderInboxPage()}
                {this.renderAlarmPage()}
                <bootstrap.OverlayTrigger
                    overlay={<bootstrap.Tooltip id="logout" className="buttonInfo">
                        {"Logout"}
                    </bootstrap.Tooltip>}
                    placement="bottom"
                    rootClose={true}
                >
                    <div onClick={this.props.logout} style={styles(theme).iconWrp}>
                        <components.Icon
                            color={theme.colors.iconHeader}
                            icon={"logout"}
                            size={"30px"}
                            style={styles(theme).icon}
                        />
                    </div>
                </bootstrap.OverlayTrigger>
            </div>
        );
    }
});

module.exports = Header;
