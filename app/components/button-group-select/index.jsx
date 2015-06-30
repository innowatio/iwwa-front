var R         = require("ramda");
var React     = require("react");
var bootstrap = require("react-bootstrap");

var ButtonGroupSelect = React.createClass({
    propTypes: {
        allowedValues: React.PropTypes.array.isRequired,
        getLabel: React.PropTypes.func,
        onChange: React.PropTypes.func.isRequired,
        value: React.PropTypes.any.isRequired
    },
    getDefaultProps: function () {
        return {
            getLabel: function (allowedValue) {
                return allowedValue.toString();
            }
        };
    },
    renderButtonOption: function (allowedValue) {
        var label = this.props.getLabel(allowedValue);
        return (
            <bootstrap.Button
                active={allowedValue === this.props.value}
                key={label}
                onClick={R.partial(this.props.onChange, allowedValue)}
            >
                {label}
            </bootstrap.Button>
        );
    },
    render: function () {
        return (
            <bootstrap.ButtonGroup className="ac-button-group-select">
                {this.props.allowedValues.map(this.renderButtonOption)}
            </bootstrap.ButtonGroup>
        );
    }
});

module.exports = ButtonGroupSelect;
