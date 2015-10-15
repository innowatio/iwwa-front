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
        // position: "absolute",
        width: "100%",
        height: measures.headerHeight,
        transition: "left 0.3s ease"
    },
    content: {
        // position: "absolute",
        top: measures.headerHeight,
        width: "100%",
        height: "100%",
        // height: "calc(100% - 90px)",
        transition: "left 0.3s ease"
    },
    sidebar: {
        position: "absolute",
        top: measures.headerHeight,
        width: measures.sidebarWidth,
        height: "100%",
        transition: "left 0.3s ease"
    },
    footer: {
        position: "fixed",
        backgroundColor: colors.greyBackground,
        color: colors.greySubTitle,
        height: measures.footerHeight,
        width: "100%",
        bottom: "0px",
        textAlign: "center"
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
                ("-" + parseInt(measures.sidebarWidth)) + "px"
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
                    style={this.getSidebarStyle()}
                    toggleSidebar={this.toggleSidebar}
                />
                <div style={styles.header}>
                    <components.Header
                        asteroid={asteroid}
                        menuClickAction={this.toggleSidebar}
                    />
                </div>
                <div style={styles.content}>
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
