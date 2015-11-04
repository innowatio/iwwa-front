var Radium    = require("radium");
var R         = require("ramda");
var React     = require("react");

var components        = require("components");
var asteroid          = require("lib/asteroid");
var measures          = require("lib/measures");
var colors            = require("lib/colors");
var icons             = require("lib/icons");
var LocalStorageMixin = require("lib/localstorage-mixin");

var styles = {
    header: {
        width: "100%",
        height: measures.headerHeight,
        transition: "left 0.3s ease"
    },
    content: {
        top: measures.headerHeight,
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
};

var Root = React.createClass({
    propTypes: {
        children: React.PropTypes.node
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
    componentDidMount: function () {
        asteroid.subscribe("users");
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
    getHeaderStyle: function () {
        return R.merge(styles.header, {
            left: (
                measures.sidebarShoulderWidth
            )
        });
    },
    getSidebarStyle: function () {
        return R.merge(styles.sidebar, {
            left: (
                this.state.sidebarOpen ?
                "0px" :
                ("-" + parseInt(ENVIRONMENT === "cordova" ? measures.sidebarWidth : measures.iconsBarWidth)) + "px"
            )
        });
    },
    renderChildren: function () {
        return React.cloneElement(this.props.children, {
            asteroid: asteroid,
            collections: this.state.collections,
            localStorage: this.state.localStorage
        });
    },
    render: function () {
        return (
            <div>
                <components.SideNav
                    items={this.getMenuItems()}
                    linkClickAction={this.closeSidebar}
                    sidebarOpen={this.state.sidebarOpen}
                    style={this.getSidebarStyle()}
                />
                <div style={styles.header}>
                    <components.Header
                        asteroid={asteroid}
                        menuClickAction={this.toggleSidebar}
                    />
                </div>
                <div style={ENVIRONMENT === "cordova" ?
                        styles.content :
                        R.merge(styles.content, {width: "calc(100vw - 55px)", float: "right"})} >
                    {this.renderChildren()}
                </div>
                <div style={styles.footer} >
                    Copyright 2015 - Innowatio
                </div>
                <components.LoginModal
                    asteroid={asteroid}
                    isOpen={!this.state.userId}
                />
            </div>
        );
    }
});

module.exports = Radium(Root);
