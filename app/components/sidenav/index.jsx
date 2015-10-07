var bootstrap  = require("react-bootstrap");
var Radium     = require("radium");
var React      = require("react");
var Router     = require("react-router");
var R          = require("ramda");

var colors   = require("lib/colors");
var measures = require("lib/measures");

var styles = {
    sidebar: {
        height: "100%",
        borderRightWidth: "1px",
        borderRightStyle: "solid",
        borderRightColor: colors.primary,
        backgroundColor: colors.white,
        zIndex: 1040// ,
        // "@media only screen": {
        //     left: "-" + measures.sidebarWidth
        // }
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
        borderLeft: "4px solid " + colors.primary,
        borderRadius: "0px",
        backgroundColor: colors.greyLight
    },
    iconsBar: {
        height: "100%",
        zIndex: 1041,
        borderRightWidth: "1px",
        borderRightStyle: "solid",
        borderRightColor: colors.primary,
        backgroundColor: colors.white
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
    resetTutorial: function () {
        localStorage[`hideTutorialOnPage_historicalGraph`] = false;
        localStorage[`hideTutorialOnPage_alarm-form`] = false;
        this.props.linkClickAction();
        location.reload();
    },
    renderIconSideBar: function (menuItem) {
        return (
            <li key={menuItem.iconPath} style={{height: "55px"}}>
                <img src={menuItem.iconPath} style={{float: "right", width: "30px"}} />
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
                    <span style={{marginLeft: "10px", verticalAlign: "middle", height: "100%"}}>{menuItem.label}</span>
                </Router.Link>
            </li>
        ) : (
            <li key={menuItem.iconPath} onClick={this.resetTutorial} style={{cursor: "pointer"}}>
                <a style={{height: "55px"}}>
                    <img src={menuItem.iconPath} style={{float: "left", width: "30px"}} />
                    <span style={{marginLeft: "10px", verticalAlign: "middle", height: "100%"}}>{menuItem.label}</span>
                </a>
            </li>
        );
    },
    render: function () {
        return (
            <div style={[styles.sidebar, this.props.style]}>
                <div id="menu" style={styles.menu}>
                    <bootstrap.Nav bsStyle="pills" stacked >
                        {this.props.items.map(this.renderNavItem)}
                    </bootstrap.Nav>
                </div>
            </div>
        );
    }
});

module.exports = Radium(SideNav);
