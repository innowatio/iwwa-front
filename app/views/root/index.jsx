import {merge} from "ramda";
import React, {PropTypes} from "react";
import {StyleRoot} from "radium";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

var asteroid          = require("lib/asteroid");
var components        = require("components");
var icons             = require("lib/icons_restyling");
var LocalStorageMixin = require("lib/localstorage-mixin");
var measures          = require("lib/measures");
import {theme, defaultTheme} from "lib/theme";
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
        height: "100%",
        transition: "left 0.3s ease"
    },
    sidebar: {
        position: "absolute",
        top: measures.headerHeight,
        width: measures.sidebarWidth,
        height: "calc(100vh - 55px)",
        transition: "left 0.3s ease",
        zIndex: 1040,
        borderRightWidth: "1px",
        borderRightStyle: "solid",
        borderRightColor: colors.primary,
        backgroundColor: colors.white
    },
    footer: {
        position: "fixed",
        backgroundColor: colors.greyBackground,
        color: colors.greySubTitle,
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
    getTheme: function () {
        const colorTheme = this.props.reduxState.userSetting.theme.color || "dark";
        return theme.getStyle(colorTheme) || defaultTheme;
    },
    getMenuItems: function () {
        return [
            {key: "dashboard", label: "Dashboard", url: "/dashboard/", iconPath: icons.iconDashboard},
            {key: "chart", label: "Consumi storici", url: "/chart/", iconPath: icons.iconHistConsum},
            {key: "live", label: "Consumi in tempo reale", url: "/live/", iconPath: icons.iconLiveConsum},
            {key: "alarms", label: "Allarmi", url: "/alarms/", iconPath: icons.iconAlarm},
            {key: "help", label: "Aiuto", onClick: "resetTutorial", iconPath: icons.iconHelp}
        ];
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
                ("-" + parseInt(ENVIRONMENT === "cordova" ? measures.sidebarWidth : measures.iconsBarWidth)) + "px"
            )
        });
    },
    render: function () {
        const styles = stylesFunction(this.getTheme());
        const titleView = this.props.children.props.route.titleView || "";
        return (
            <StyleRoot>
                <components.SideNav
                    items={this.getMenuItems()}
                    linkClickAction={this.closeSidebar}
                    sidebarOpen={this.state.sidebarOpen}
                    style={this.getSidebarStyle(styles)}
                />
                <div style={styles.header}>
                    <components.Header
                        asteroid={asteroid}
                        menuClickAction={this.toggleSidebar}
                        selectThemeColor={this.props.selectThemeColor}
                        title={titleView}
                        userSetting={this.props.reduxState.userSetting}
                    />
                </div>
                <div style={
                    ENVIRONMENT === "cordova" ?
                    styles.content :
                    merge(styles.content, {width: `calc(100% - ${measures.sidebarShoulderWidth})`, float: "right"})}
                >
                    <components.PageContainer
                        asteroid={asteroid}
                        children={this.props.children}
                        collections={this.state.collections}
                        localStorage={this.state.localStorage}
                        reduxState={this.props.reduxState}
                    />
                </div>
                <div style={styles.footer}>
                    {"Copyright 2015 - Innowatio"}
                </div>
                <components.LoginModal
                    asteroid={asteroid}
                    isOpen={!this.state.userId}
                />
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
        selectThemeColor: bindActionCreators(selectThemeColor, dispatch)
    };
}
module.exports = connect(mapStateToProps, mapDispatchToProps)(Root);
