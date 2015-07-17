var Immutable  = require("immutable");
var R          = require("ramda");
var React      = require("react");
var bootstrap  = require("react-bootstrap");
var IPropTypes = require("react-immutable-proptypes");


var components = require("components");

var ButtonGroupSelect = React.createClass({
    propTypes: {
        allowedValues: React.PropTypes.array.isRequired,
        getKey: React.PropTypes.func,
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
        var defaultGetter = function (allowedItem) {
            return allowedItem.toString();
        };
        return {
            multi: false,
            getKey: defaultGetter,
            getLabel: defaultGetter
        };
    },
    isActiveMulti: function (allowedValue) {
        var keys = this.props.value.map(this.props.getKey);
        var key = this.props.getKey(allowedValue);
        return (
            R.is(Immutable.List, keys) ?
            keys.contains(key) :
            R.contains(key, keys)
        );
    },
    isActive: function (allowedValue) {
        return (
            this.props.multi ?
            this.isActiveMulti(allowedValue) :
            this.props.getKey(allowedValue) === this.props.getKey(this.props.value)
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
        return (
            <components.Button
                active={this.isActive(allowedValue)}
                key={this.props.getKey(allowedValue)}
                onClick={R.partial(this.onChange, allowedValue)}
            >
                {this.props.getLabel(allowedValue)}
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
