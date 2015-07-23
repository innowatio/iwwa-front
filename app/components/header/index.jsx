var Radium = require("radium");
var React  = require("react");

var components = require("components");
var colors = require("lib/colors");

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
        cursor: "pointer"
    }
};

var Header = React.createClass({
    propTypes: {
        asteroid: React.PropTypes.object.isRequired
    },
    logout: function () {
        this.props.asteroid.logout();
    },
    render: function () {
        var iconLogout = "/_assets/icons/os__logout.svg";
        var iconLogo   = "/_assets/icons/os__link_dashboard.svg";
        return (
            <div style={styles.base}>
                <img src={iconLogo} style={{width: "25px"}}/>
                <span onClick={this.logout} style={styles.logout}>
                    <components.Spacer direction="h" size={8} />
                    <img src={iconLogout} style={{width: "25px"}}/>
                </span>
            </div>
        );
    }
});

module.exports = Radium(Header);
