var bootstrap  = require("react-bootstrap");
var Radium     = require("radium");
var React      = require("react");
var Router     = require("react-router");

var colors   = require("lib/colors");
var measures = require("lib/measures");

var styles = {
    sidebar: {
        height: "100%",
        borderRightWidth: "1px",
        borderRightStyle: "solid",
        borderRightColor: colors.primary,
        backgroundColor: colors.white,
        zIndex: 100,
        "@media only screen": {
            left: "-" + measures.sidebarWidth
        }
    },
    hamburger: {
        height: measures.headerHeight,
        backgroundColor: colors.primary,
        fontSize: "35px",
        textAlign: "left",
        paddingRight: "15px",
        paddingTop: "5px",
        cursor: "pointer"
    },
    menu: {
        position: "absolute",
        width: "100%"
    },
    activeLink: {
        borderRight: "4px solid " + colors.primary,
        borderRadius: "0px",
        backgroundColor: colors.greyLight
    }
};

var SideNav = React.createClass({
    propTypes: {
        items: React.PropTypes.arrayOf(
            React.PropTypes.object
        ),
        linkClickAction: React.PropTypes.func,
        style: React.PropTypes.object,
        toggleSidebar: React.PropTypes.func.isRequired
    },
    getInitialState: function () {
        return {
            visible: false
        };
    },
    renderNavItem: function (menuItem) {
        return (
            <li key={menuItem.iconPath}>
                <Router.Link
                    activeStyle={styles.activeLink}
                    onClick={this.props.linkClickAction}
                    style={{height: "55px"}}
                    to={menuItem.url}
                >
                    {menuItem.label}
                    <img src={menuItem.iconPath} style={{float: "right", width: "30px"}} />
                </Router.Link>
            </li>
        );
    },
    render: function () {
        return (
            <div style={[styles.sidebar, this.props.style]}>
                <div style={styles.menu}>
                    <bootstrap.Nav bsStyle="pills" stacked >
                        {this.props.items.map(this.renderNavItem)}
                    </bootstrap.Nav>
                </div>
            </div>
        );
    }
});

module.exports = Radium(SideNav);
