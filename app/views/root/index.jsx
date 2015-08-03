var Radium = require("radium");
var R      = require("ramda");
var React  = require("react");

var components = require("components");
var asteroid   = require("lib/asteroid");
var measures   = require("lib/measures");
var colors     = require("lib/colors");

// Decommment for debugging
// window.asteroid = asteroid;
// asteroid._ddp._socket.on("message:in", console.log.bind(console));
// asteroid._ddp._socket.on("message:out", console.log.bind(console));

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
        position: "absolute",
        backgroundColor: colors.greyBackground,
        color: colors.greySubTitle,
        height: measures.footerHeight,
        width: "100%",
        bottom: "0px",
        textAlign: "center"
    }
};

var icoAlarm      = "/_assets/icons/os__Alarms_menu-.svg";
var icoHistConsum = "/_assets/icons/os__Historical_consumption-.svg";
var icoDashboard  = "/_assets/icons/os__Dashboard-.svg";
var icoHelp       = "/_assets/icons/os__Help.svg";
var icoLiveConsum = "/_assets/icons/os__Live_consumption-.svg";

var Root = React.createClass({
    propTypes: {
        children: React.PropTypes.node
    },
    mixins: [
        asteroid.getControllerViewMixin()
    ],
    getInitialState: function () {
        return {
            sidebarOpen: false
        };
    },
    getMenuItems: function () {
        return [
            {key: "dashboard", label: "Dashboard", url: "/dashboard/", iconPath: icoDashboard},
            {key: "chart", label: "Historical Consumption", url: "/chart/", iconPath: icoHistConsum},
            {key: "live", label: "Live Consumption", url: "/live/", iconPath: icoLiveConsum},
            {key: "alarms", label: "Alarms", url: "/alarms/", iconPath: icoAlarm},
            {key: "help", label: "Help", url: "/help/", iconPath: icoHelp}
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
            collections: this.state.collections
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
