var Immutable  = require("immutable");
var R          = require("ramda");
var React      = require("react");
var bootstrap  = require("react-bootstrap");
var IPropTypes = require("react-immutable-proptypes");

var colors     = require("lib/colors");
var components = require("components");
var styles     = require("lib/styles");

var styleDropdown = R.merge(
        styles.buttonSelectValore,
        {color: colors.greySubTitle, backgroundColor: colors.greyBackground}
    );

var ButtonGroupSelect = React.createClass({
    propTypes: {
        allowedValues: React.PropTypes.array.isRequired,
        getActiveStyle: React.PropTypes.func,
        getKey: React.PropTypes.func,
        getLabel: React.PropTypes.func,
        multi: React.PropTypes.bool,
        onChange: React.PropTypes.func.isRequired,
        value: React.PropTypes.oneOfType([
            React.PropTypes.array,
            IPropTypes.list
        ])
    },
    mixins: [React.addons.PureRenderMixin],
    getDefaultProps: function () {
        var defaultGetter = function (allowedValue) {
            return allowedValue.toString();
        };
        return {
            getActiveStyle: R.always({}),
            getKey: defaultGetter,
            getLabel: defaultGetter,
            multi: false
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
    isActiveSingle: function (allowedValue) {
        var keys = this.props.value.map(this.props.getKey);
        var key = this.props.getKey(allowedValue);
        return (
            R.is(Immutable.List, keys) ?
            keys.first() === key :
            keys[0] === key
        );
    },
    isActive: function (allowedValue) {
        return (
            this.props.multi ?
            this.isActiveMulti(allowedValue) :
            this.isActiveSingle(allowedValue)
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
    onChangeSingle: function (allowedValue) {
        this.props.onChange(
            R.is(Immutable.List, this.props.value) ?
            Immutable.List(allowedValue) :
            [allowedValue]
        );
    },
    onChange: function (allowedValue) {
        return (
            this.props.multi ?
            this.onChangeMulti(allowedValue) :
            this.onChangeSingle(allowedValue)
        );
    },
    renderButtonOption: function (allowedValue) {
        var active = this.isActive(allowedValue);
        return (
            <components.Button
                active={active}
                key={this.props.getKey(allowedValue)}
                onClick={R.partial(this.onChange, allowedValue)}
                style={active ? this.props.getActiveStyle(allowedValue) : styleDropdown}
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
