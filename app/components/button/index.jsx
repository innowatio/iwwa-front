var R         = require("ramda");
var React     = require("react");
var bootstrap = require("react-bootstrap");

var colors = require("lib/colors");

var Button = React.createClass({
    propTypes: {
        active: React.PropTypes.bool,
        style: React.PropTypes.object
    },
    render: function () {
        var button = (
            <bootstrap.Button {...this.props} />
        );
        return React.cloneElement(button, {
            style: R.merge({
                background: this.props.active ? colors.lineReale : colors.white,
                color: this.props.active ? colors.white : colors.black,
                outline: "0px",
                outlineStyle: "none",
                outlineWidth: "0px"
            }, this.props.style)
        });
    }
});

module.exports = Button;
