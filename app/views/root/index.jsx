import {merge} from "ramda";
import React, {PropTypes} from "react";
import {StyleRoot} from "radium";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

var asteroid          = require("lib/asteroid");
var components        = require("components");
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
        height: `calc(100vh - ${measures.headerHeight})`,
        transition: "left 0.3s ease"
    },
    sidebar: {
        position: "absolute",
        top: measures.headerHeight,
        width: measures.sidebarWidth,
        left: `-${measures.sidebarWidth}px`,
        height: "calc(100vh - 55px)",
        fontSize: "15px",
        transition: "left 0.3s ease",
        zIndex: 1040,
        backgroundColor: colors.navBackground
    },
    footer: {
        position: "fixed",
        backgroundColor: colors.darkBlack,
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
            {key: "dashboard", label: "DASHBOARD", url: "/dashboard/", iconClassName: "dashboard"},
            {key: "chart", label: "CONSUMI STORICI", url: "/chart/", iconClassName: "history"},
            {key: "live", label: "CONSUMI LIVE", url: "/live/", iconClassName: "gauge"},
            {key: "alarms", label: "ALLARMI", url: "/alarms/", iconClassName: "alarms"},
            {key: "help", label: "AIUTO", onClick: "resetTutorial", iconClassName: "help"}
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
                `-${parseInt(measures.sidebarWidth)}px`
            )
        });
    },
    renderFooter: function (styles) {
        return ENVIRONMENT !== "cordova" ? (
            <div style={styles.footer}>
                {"Copyright 2015 - Innowatio"}
            </div>
        ) : null;
    },
    render: function () {
        const styles = stylesFunction(this.getTheme());
        const titleView = this.props.children.props.route.titleView || "";
        return (
            <StyleRoot>
                <div style={{backgroundColor: this.getTheme().background}}>
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
                    <div style={styles.content}>
                        <components.PageContainer
                            asteroid={asteroid}
                            children={this.props.children}
                            collections={this.state.collections}
                            localStorage={this.state.localStorage}
                            reduxState={this.props.reduxState}
                        />
                    </div>
                    {this.renderFooter(styles)}
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
        selectThemeColor: bindActionCreators(selectThemeColor, dispatch)
    };
}
module.exports = connect(mapStateToProps, mapDispatchToProps)(Root);
