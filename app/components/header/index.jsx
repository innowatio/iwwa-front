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
        return (
            <div style={styles.base}>
                <span>
                    {"Innowatio"}
                </span>
                <span onClick={this.logout} style={styles.logout}>
                    <i>
                        {"Logout"}
                    </i>
                    <components.Spacer direction="h" size={8} />
                    <components.Icon icon="sign-out" />
                </span>
            </div>
        );
    }
});

module.exports = Radium(Header);
