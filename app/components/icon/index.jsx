var Radium = require("radium");
var React  = require("react");

var Icon = React.createClass({
    propTypes: {
        className: React.PropTypes.string,
        color: React.PropTypes.string,
        icon: React.PropTypes.string.isRequired,
        onClick: React.PropTypes.func,
        size: React.PropTypes.string,
        style: React.PropTypes.object
    },
    getDefaultProps: function () {
        return {
            color: "",
            onClick: undefined,
            size: "",
            spin: false,
            style: {}
        };
    },
    getClassName: function () {
        return [
            // IWWA font icon class
            ("icon icon-iw-" + this.props.icon),
            this.props.className || ""
        ].join(" ");
    },
    getStyle: function () {
        return {
            color: this.props.color,
            cursor: (this.props.onClick ? "pointer" : ""),
            fontSize: this.props.size
        };
    },
    render: function () {
        return (
            <i
                className={this.getClassName()}
                onClick={this.props.onClick}
                style={[this.getStyle(), this.props.style]}
            />
        );
    }
});

module.exports = Radium(Icon);
