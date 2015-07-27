var Radium = require("radium");
var React  = require("react");

var components = require("components");
var colors     = require("lib/colors");
var measures   = require("lib/measures");

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
        height: measures.headerHeight,
        backgroundColor: colors.primary,
        alignItems: "center",
        color: colors.white,
        fontSize: "35px",
        textAlign: "right",
        paddingRight: "15px",
        paddingTop: "5px",
        cursor: "pointer"
    }
};

var icoMenu = "fa fa-bars";

var Header = React.createClass({
    propTypes: {
        asteroid: React.PropTypes.object.isRequired,
        menuClickAction: React.PropTypes.func
    },
    logout: function () {
        this.props.asteroid.logout();
    },
    render: function () {
        var iconLogout = "/_assets/icons/os__logout.svg";
        var iconLogo   = "/_assets/icons/os__link_dashboard.svg";
        return (
            <div style={styles.base}>
                <span
                    className={icoMenu}
                    onClick={this.props.menuClickAction}
                    style={styles.hamburger}
                />
                <span style={styles.base}>
                    <img src={iconLogo} />
                </span>
                <span onClick={this.logout} style={styles.logout}>
                    <img src={iconLogout} />
                </span>
            </div>
        );
    }
});

module.exports = Radium(Header);
