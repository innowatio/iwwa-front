var bootstrap  = require("react-bootstrap");
var React      = require("react");
var Router     = require("react-router");
var R          = require("ramda");

var colors   = require("lib/colors");

var styles = {
    menu: {
        position: "absolute",
        width: "100%"
    },
    activeLink: {
        borderLeft: "4px solid " + colors.primary,
        borderRadius: "0px",
        backgroundColor: colors.greyLight
    },
    sideLabel: {
        color: colors.primary,
        marginLeft: "10px",
        verticalAlign: "middle",
        height: "100%"
    }
};

var SideNav = React.createClass({
    propTypes: {
        items: React.PropTypes.arrayOf(
            React.PropTypes.object
        ),
        linkClickAction: React.PropTypes.func,
        sidebarOpen: React.PropTypes.bool,
        style: React.PropTypes.object
    },
    getInitialState: function () {
        return {
            visible: false
        };
    },
    resetTutorial: function () {
        localStorage[`hideTutorialOnPage_historicalGraph`] = false;
        localStorage[`hideTutorialOnPage_alarm-form`] = false;
        this.props.linkClickAction();
        location.reload();
    },
    renderIconSideBar: function (menuItem) {
        return !R.isNil(menuItem.url) ? (
            <li key={menuItem.iconPath} style={{height: "55px"}}>
                <Router.Link
                    activeStyle={styles.activeLink}
                    onClick={this.props.linkClickAction}
                    style={{height: "55px"}}
                    to={menuItem.url}
                >
                    <img src={menuItem.iconPath} style={{float: "right", width: "30px"}} />
                </Router.Link>
            </li>
        ) : (
            <li key={menuItem.iconPath} onClick={this.resetTutorial} style={{height: "55px", cursor: "pointer"}}>
                <a style={{height: "55px"}}>
                    <img src={menuItem.iconPath} style={{float: "right", width: "30px"}} />
                </a>
            </li>
        );
    },
    renderNavItem: function (menuItem) {
        return !R.isNil(menuItem.url) ? (
            <li key={menuItem.iconPath}>
                <Router.Link
                    activeStyle={styles.activeLink}
                    onClick={this.props.linkClickAction}
                    style={{height: "55px"}}
                    to={menuItem.url}
                >
                    <img src={menuItem.iconPath} style={{float: "left", width: "30px"}} />
                    <span style={styles.sideLabel}>
                        {menuItem.label}
                    </span>
                </Router.Link>
            </li>
        ) : (
            <li key={menuItem.iconPath} onClick={this.resetTutorial} style={{cursor: "pointer"}}>
                <a style={{height: "55px"}}>
                    <img src={menuItem.iconPath} style={{float: "left", width: "30px"}} />
                    <span style={styles.sideLabel}>
                        {menuItem.label}
                    </span>
                </a>
            </li>
        );
    },
    render: function () {
        return ENVIRONMENT === "cordova" || this.props.sidebarOpen ? (
            <div style={this.props.style}>
                <div id="menu" style={styles.menu}>
                    <bootstrap.Nav bsStyle="pills" stacked >
                        {this.props.items.map(this.renderNavItem)}
                    </bootstrap.Nav>
                </div>
            </div>
        ) : (
            <div style={this.props.style}>
                <div id="menu" style={styles.menu}>
                    <bootstrap.Nav bsStyle="pills" stacked >
                        {this.props.items.map(this.renderIconSideBar)}
                    </bootstrap.Nav>
                </div>
            </div>
        );
    }
});

module.exports = SideNav;
