var Router = require("react-router");
var Radium = require("radium");
var React  = require("react");

var colors   = require("lib/colors");
var measures = require("lib/measures");
var icons    = require("lib/icons");

var styles = {
    base: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "15px",
        background: colors.primary,
        width: "100%",
        height: "100%",
        color: colors.white
    },
    logout: {
        cursor: "pointer",
        alignItems: "center"
    },
    hamburger: {
        cursor: "pointer"
    }
};

var Header = React.createClass({
    propTypes: {
        asteroid: React.PropTypes.object.isRequired,
        menuClickAction: React.PropTypes.func
    },
    logout: function () {
        this.props.asteroid.logout();
    },
    render: function () {
        return (
            <div style={styles.base}>
                <img onClick={this.props.menuClickAction} src={icons.iconMenu}  style={styles.hamburger}/>
                <span style={styles.base}>
                    <Router.Link to="/dashboard/" >
                        <img src={icons.iconLogo} />
                    </Router.Link>
                </span>
                <span onClick={this.logout} style={styles.logout}>
                    <img className="pull-right" src={icons.iconLogout} style={{width: "85%"}}/>
                </span>
            </div>
        );
    }
});

module.exports = Radium(Header);
