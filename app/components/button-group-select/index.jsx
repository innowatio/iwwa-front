var Immutable  = require("immutable");
var R          = require("ramda");
var React      = require("react");
var bootstrap  = require("react-bootstrap");
var IPropTypes = require("react-immutable-proptypes");


var components = require("components");

var ButtonGroupSelect = React.createClass({
    propTypes: {
        allowedValues: React.PropTypes.array.isRequired,
        getLabel: React.PropTypes.func,
        multi: React.PropTypes.bool,
        onChange: React.PropTypes.func.isRequired,
        value: function (props, propName, componentName) {
            var validator = (
                props.multi === true ?
                React.PropTypes.oneOfType([
                    React.PropTypes.array,
                    IPropTypes.list
                ]) :
                React.PropTypes.any.isRequired
            );
            return validator(props, propName, componentName);
        }
    },
    mixins: [React.addons.PureRenderMixin],
    getDefaultProps: function () {
        return {
            multi: false,
            getLabel: function (allowedValue) {
                return allowedValue.toString();
            }
        };
    },
    isActiveMulti: function (allowedValue) {
        return (
            R.is(Immutable.List, this.props.value) ?
            this.props.value.contains(allowedValue) :
            R.contains(allowedValue, this.props.value)
        );
    },
    isActive: function (allowedValue) {
        return (
            this.props.multi ?
            this.isActiveMulti(allowedValue) :
            allowedValue === this.props.value
        );
    },
    onChangeMulti: function (allowedValue) {
        var index = this.props.value.indexOf(allowedValue);
        if (index === -1) {
            /*
            *   The array does not contain the current value, hence we add it
            */
            this.props.onChange(
                R.is(Immutable.List, this.props.value) ?
                this.props.value.push(allowedValue) :
                R.append(allowedValue, this.props.value)
            );
        } else {
            /*
            *   The array contains the current value, hence we remove it
            */
            this.props.onChange(
                R.is(Immutable.List, this.props.value) ?
                this.props.value.remove(index) :
                R.remove(index, 1, this.props.value)
            );
        }
    },
    onChange: function (allowedValue) {
        return (
            this.props.multi ?
            this.onChangeMulti(allowedValue) :
            this.props.onChange(allowedValue)
        );
    },
    renderButtonOption: function (allowedValue) {
        var label = this.props.getLabel(allowedValue);
        return (
            <components.Button
                active={this.isActive(allowedValue)}
                key={label}
                onClick={R.partial(this.onChange, allowedValue)}
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
