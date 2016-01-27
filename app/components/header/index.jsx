var Immutable = require("immutable");
var Router    = require("react-router");
var Radium    = require("radium");
var React     = require("react");
var R         = require("ramda");

var colors = require("lib/colors_restyling");
var icons  = require("lib/icons_restyling");

var styles = {
    base: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px",
        background: colors.primary,
        height: "100%",
        color: colors.white
    },
    icon: {
        cursor: "pointer",
        alignItems: "center"
    },
    hamburger: {
        cursor: "pointer"
    },
    viewTitle: {
        margin: "auto",
        fontSize: "20px",
        borderBottom: `3px solid ${colors.buttonPrimary}`
    }
};

var Header = React.createClass({
    propTypes: {
        asteroid: React.PropTypes.object.isRequired,
        menuClickAction: React.PropTypes.func,
        title: React.PropTypes.string
    },
    logout: function () {
        this.props.asteroid.logout();
    },
    userIsAdmin: function () {
        const users = this.props.asteroid.collections.get("users") || Immutable.Map();
        const roles = users.getIn([this.props.asteroid.userId, "roles"]) || Immutable.List();
        return roles.includes("admin");
    },
    renderAdminPage: function () {
        return this.userIsAdmin() && ENVIRONMENT !== "cordova" ? (
            <span style={{marginRight: "10px"}}>
                <Router.Link to="/users/" >
                    <img className="pull-right" src={icons.iconUser} style={{width: "25px"}} />
                </Router.Link>
            </span>
        ) : null;
    },
    render: function () {
        return (
            <div style={styles.base}>
                <img onClick={this.props.menuClickAction} src={icons.iconMenu}  style={styles.hamburger}/>
                <span style={R.merge(styles.base, {marginLeft: "15px"})}>
                    <Router.Link to="/dashboard/" >
                        <img src={icons.iconLogo} />
                    </Router.Link>
                </span>
                <div style={styles.viewTitle}>
                    {this.props.title.toUpperCase()}
                </div>
                {this.renderAdminPage()}
                <span onClick={this.logout} style={styles.icon}>
                    <img className="pull-right" src={icons.iconLogout} style={{width: "85%"}}/>
                </span>
            </div>
        );
    }
});

module.exports = Radium(Header);
