var bootstrap  = require("react-bootstrap");
var Radium     = require("radium");
var React      = require("react");
var Router     = require("react-router");

var colors = require("lib/colors");
var measures = require("lib/measures");

var styles = {
    sidebar: {
        height: "100%",
        borderRightWidth: "1px",
        borderRightStyle: "solid",
        borderRightColor: colors.primary
    },
    hamburger: {
        position: "absolute",
        top: "0px",
        left: "0px",
        width: "100%",
        height: measures.headerHeight,
        backgroundColor: colors.primary,
        alignItems: "center",
        color: colors.white,
        fontSize: "35px",
        textAlign: "right",
        paddingRight: "15px",
        paddingTop: "5px",
        cursor: "pointer"
    },
    menu: {
        position: "absolute",
        top: measures.headerHeight,
        width: "100%"
    },
    activeLink: {
        borderRight: "4px solid " + colors.primary,
        borderRadius: "0px",
        backgroundColor: colors.greyLight
    }
};

var icoMenu = "fa fa-bars";

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
            <li>
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
                <div
                    className={icoMenu}
                    onClick={this.props.toggleSidebar}
                    style={styles.hamburger}
                >
                </div>
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