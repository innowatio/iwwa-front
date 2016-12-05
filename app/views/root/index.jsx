import {merge} from "ramda";
import React, {PropTypes} from "react";
import {StyleRoot} from "radium";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import get from "lodash.get";
import pkg from "../../../package.json";

import components from "components";

import asteroid from "lib/asteroid";
import {EXEC_ENV} from "lib/config";
import LocalStorageMixin from "lib/localstorage-mixin";
import measures from "lib/measures";
import moment from "lib/moment";
import {getLoggedUser, hasRole, isAuthorizedUser, ACCESS_LUCY_PRO, ACCESS_LUCY_LIGHT} from "lib/roles-utils";
import {theme, defaultTheme} from "lib/theme";
import {isActiveUser, isDeleted} from "lib/users-utils";

import {closeNotificationModal} from "actions/notifications";
import {selectThemeColor} from "actions/user-setting";

const stylesFunction = ({colors}) => ({
    header: {
        width: "100%",
        height: measures.headerHeight,
        transition: "left 0.3s ease"
    },
    content: {
        width: "100%",
        top: measures.headerHeight,
        backgroundColor: colors.background,
        height: `calc(100vh - ${measures.headerHeight})`,
        transition: "left 0.3s ease",
        overflow: "auto"
    },
    sidebar: {
        position: "absolute",
        top: measures.headerHeight,
        width: measures.sidebarWidth,
        left: `-${measures.sidebarWidth}px`,
        height: `calc(100vh - ${measures.headerHeight})`,
        fontSize: "15px",
        transition: "left 0.3s ease",
        zIndex: 1040,
        backgroundColor: colors.navBackground
    },
    footer: {
        position: "fixed",
        backgroundColor: colors.backgroundFooter,
        color: colors.textFooter,
        fontWeight: 300,
        lineHeight: "30px",
        height: measures.footerHeight,
        width: "100%",
        bottom: "0px",
        textAlign: "center",
        zIndex: 1042
    }
});

var Root = React.createClass({
    propTypes: {
        children: PropTypes.node,
        closeNotificationModal: PropTypes.func,
        reduxState: PropTypes.object,
        selectThemeColor: PropTypes.func
    },
    childContextTypes: {
        theme: PropTypes.object
    },
    mixins: [
        asteroid.getControllerViewMixin(),
        LocalStorageMixin
    ],
    getInitialState: function () {
        return {
            sidebarOpen: false
        };
    },
    getChildContext: function () {
        return {
            theme: this.getTheme()
        };
    },
    componentDidMount: function () {
        asteroid.subscribe("users");
    },
    logout: function () {
        asteroid.logout();
    },
    getTheme: function () {
        const colorTheme = this.props.reduxState.userSetting.theme.color || "dark";
        return theme.getStyle(colorTheme) || defaultTheme;
    },
    getMenuItems: function () {
        var items = [];
        // user yousave => solo yousave
        // admin tutto
        if (hasRole(asteroid, ACCESS_LUCY_LIGHT)) {
            items = items.concat([
                {key: "multisite", label: "DASHBOARD", url: "/multisite/", iconClassName: "dashboard"},
                {key: "chart", label: "CONSUMI STORICI", url: "/chart/", iconClassName: "history"},
                {key: "live", label: "CONSUMI LIVE", url: "/live/", iconClassName: "gauge"},
                {key: "consumptions", label: "RIEPILOGO CONSUMI", url: "/consumptions/", iconClassName: "percentage"},
                {key: "alarms", label: "ALLARMI", url: "/alarms/", iconClassName: "alarms"}
            ]);
        }
        if (hasRole(asteroid, ACCESS_LUCY_PRO)) {
            items.push({key: "monitoring", label: "MONITORING", url: "/monitoring/", iconClassName: "monitoring"});
        }
        return items;
    },
    toggleSidebar: function () {
        this.setState({
            sidebarOpen: !this.state.sidebarOpen
        });
    },
    closeSidebar: function () {
        this.setState({
            sidebarOpen: false
        });
    },
    getSidebarStyle: function (styles) {
        return merge(styles.sidebar, {
            left: (
                this.state.sidebarOpen ?
                "0px" :
                `-${parseInt(measures.sidebarWidth)}px`
            )
        });
    },
    renderFooter: function (styles) {
        return EXEC_ENV !== "cordova" ? (
            <div style={styles.footer}>
                {`Versione ${pkg.version} - Copyright ${moment().format("YYYY")} ©Innowatio SpA`}
            </div>
        ) : null;
    },
    renderSideNav: function (styles) {
        return isAuthorizedUser(asteroid) ? (
            <components.SideNav
                items={this.getMenuItems()}
                linkClickAction={this.closeSidebar}
                sidebarOpen={this.state.sidebarOpen}
                style={this.getSidebarStyle(styles)}
            />
        ) : null;
    },
    render: function () {
        const {notifications} = this.props.reduxState;
        const styles = stylesFunction(this.getTheme());
        const titleView = this.props.children.props.route.titleView || "";
        const user = getLoggedUser(asteroid);
        return (
            <StyleRoot>
                <div style={{backgroundColor: this.getTheme().background}}>
                    {this.renderSideNav(styles)}
                    <div style={styles.header}>
                        <components.Header
                            asteroid={asteroid}
                            isAuthorizedUser={isAuthorizedUser(asteroid)}
                            logout={this.logout}
                            menuClickAction={this.toggleSidebar}
                            selectThemeColor={this.props.selectThemeColor}
                            title={titleView}
                            userSetting={this.props.reduxState.userSetting}
                        />
                    </div>
                    <div style={styles.content}>
                        <components.NotificationModal
                            closeModal={this.props.closeNotificationModal}
                            message={get(notifications, "data.message", "")}
                            show={notifications.showModal}
                        />
                        <components.PageContainer
                            asteroid={asteroid}
                            children={this.props.children}
                            collections={this.state.collections}
                            localStorage={this.state.localStorage}
                            reduxState={this.props.reduxState}
                        />
                    </div>
                    {this.renderFooter(styles)}
                    <components.UnauthorizedModal
                        isOpen={(!isAuthorizedUser(asteroid) || !isActiveUser(user) || isDeleted(user)) === true}
                    />
                    <components.LoginModal
                        asteroid={asteroid}
                        isOpen={!this.state.userId}
                    />
                </div>
            </StyleRoot>
        );
    }
});

function mapStateToProps (state) {
    return {
        reduxState: state
    };
}
function mapDispatchToProps (dispatch) {
    return {
        closeNotificationModal: bindActionCreators(closeNotificationModal, dispatch),
        selectThemeColor: bindActionCreators(selectThemeColor, dispatch)
    };
}
module.exports = connect(mapStateToProps, mapDispatchToProps)(Root);
