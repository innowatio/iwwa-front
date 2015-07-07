var R         = require("ramda");
var React     = require("react");
var bootstrap = require("react-bootstrap");

var components = require("components");

var ButtonGroupSelect = React.createClass({
    propTypes: {
        allowedValues: React.PropTypes.array.isRequired,
        getLabel: React.PropTypes.func,
        onChange: React.PropTypes.func.isRequired,
        value: React.PropTypes.any.isRequired
    },
    mixins: [React.addons.PureRenderMixin],
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
            <components.Button
                active={allowedValue === this.props.value}
                key={label}
                onClick={R.partial(this.props.onChange, allowedValue)}
            >
                {label}
            </components.Button>
        );
    },
    render: function () {
        return (
            <bootstrap.ButtonGroup>
                {this.props.allowedValues.map(this.renderButtonOption)}
            </bootstrap.ButtonGroup>
        );
    }
});

module.exports = ButtonGroupSelect;
