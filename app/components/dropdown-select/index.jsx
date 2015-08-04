var R          = require("ramda");
var React      = require("react");
var bootstrap  = require("react-bootstrap");
var IPropTypes = require("react-immutable-proptypes");

var DropdownSelect = React.createClass({
    propTypes: {
        allowedValues: React.PropTypes.oneOfType([
            React.PropTypes.array,
            IPropTypes.iterable
        ]).isRequired,
        getKey: React.PropTypes.func,
        getLabel: React.PropTypes.func,
        onChange: React.PropTypes.func.isRequired,
        title: React.PropTypes.string,
        value: React.PropTypes.any
    },
    getDefaultProps: function () {
        var defaultGetter = function (allowedValue) {
            return allowedValue.toString();
        };
        return {
            getKey: defaultGetter,
            getLabel: defaultGetter
        };
    },
    shouldComponentUpdate: function (nextProps) {
        return !(
            this.props.allowedValues === nextProps.allowedValues &&
            this.props.getKey === nextProps.getKey &&
            this.props.getLabel === nextProps.getLabel &&
            this.props.title === nextProps.title &&
            this.props.value === nextProps.value
        );
    },
    renderButtonOption: function (allowedValue) {
        return (
            <bootstrap.MenuItem
                active={allowedValue === this.props.value}
                key={this.props.getKey(allowedValue)}
                onSelect={R.partial(this.props.onChange, allowedValue)}
            >
                {this.props.getLabel(allowedValue)}
            </bootstrap.MenuItem>
        );
    },
    render: function () {
        var items = this.props.allowedValues.map(this.renderButtonOption);
        return (
            <bootstrap.DropdownButton title={this.props.title}>
                {items.toArray ? items.toArray() : items}
            </bootstrap.DropdownButton>
        );
    }
});

module.exports = DropdownSelect;
