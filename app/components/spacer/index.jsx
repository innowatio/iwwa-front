var React = require("react");

var Spacer = React.createClass({
    propTypes: {
        direction: React.PropTypes.oneOf(["h", "v"]).isRequired,
        size: React.PropTypes.number.isRequired
    },
    renderH: function () {
        return (
            <span
                style={{
                    display: "inline-block",
                    width: this.props.size + "px"
                }}
            />
        );
    },
    renderV: function () {
        return (
            <div
                style={{
                    width: "100%",
                    height: this.props.size + "px"
                }}
            />
        );
    },
    render: function () {
        var method = "render" + this.props.direction.toUpperCase();
        return this[method]();
    }
});

module.exports = Spacer;
