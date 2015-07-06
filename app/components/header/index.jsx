var Radium = require("radium");
var React  = require("react");

var components = require("components");
var colors = require("lib/colors");

var styles = {
    base: {
        background: colors.primary,
        width: "100%",
        height: "100%",
        color: colors.white
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
                {"Innowatio"}
                <components.Icon
                    icon="arrow-left"
                    onClick={this.logout}
                />
            </div>
        );
    }
});

module.exports = Radium(Header);
