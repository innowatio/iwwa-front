var Radium = require("radium");
var React  = require("react");

var colors = require("lib/colors");

var styles = {
    base: {
        background: colors.black,
        width: "100%",
        height: "100%",
        color: colors.white
    }
};

var Header = React.createClass({
    render: function () {
        return (
            <div style={styles.base}>
                {"Innowatio"}
            </div>
        );
    }
});

module.exports = Radium(Header);
