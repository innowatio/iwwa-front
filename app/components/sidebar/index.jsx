var bootstrap  = require("react-bootstrap");
var Radium     = require("radium");
var React      = require("react");
var Router     = require("react-router");

var colors = require("lib/colors");
var measures = require("lib/measures");

var styles = {
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
        paddingTop: "5px"
    },
    menu: {
        position: "absolute",
        top: measures.headerHeight,
        width: "100%"
    }
};

var icoMenu = "fa fa-bars";

var SideNav = React.createClass({
    propTypes: {
        items: React.PropTypes.arrayOf(
            React.PropTypes.object
        ),
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
                <Router.Link style={{height: "55px"}} to={menuItem.url}>
                    {menuItem.label}
                    <img src={menuItem.iconPath} style={{float: "right", width: "30px"}} />
                </Router.Link>
            </li>
        );
    },
    render: function () {
        return (
            <span style={this.props.style}>
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
            </span>
        );
    }
});

module.exports = Radium(SideNav);
