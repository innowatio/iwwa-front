var bootstrap       = require("react-bootstrap");
var Immutable       = require("immutable");
var IPropTypes      = require("react-immutable-proptypes");
var R               = require("ramda");
var React           = require("react");
var ReactPureRender = require("react-addons-pure-render-mixin");

var colors     = require("lib/colors");
var components = require("components");
var styles     = require("lib/styles");
var icons      = require("lib/icons");

var styleDropdown = R.merge(
    styles.buttonSelectValore,
    {
        color: colors.greySubTitle,
        backgroundColor: colors.greyBackground
    }
);

var ButtonGroupSelect = React.createClass({
    propTypes: {
        allowedValues: React.PropTypes.oneOfType([
            React.PropTypes.array,
            IPropTypes.list
        ]).isRequired,
        filter: React.PropTypes.bool,
        getActiveStyle: React.PropTypes.func,
        getKey: React.PropTypes.func,
        getLabel: React.PropTypes.func,
        // This parameter is for check if the sources are two (real and previsional)
        multi: React.PropTypes.bool,
        onChange: React.PropTypes.func.isRequired,
        value: React.PropTypes.oneOfType([
            React.PropTypes.array,
            IPropTypes.list
        ]),
        vertical: React.PropTypes.bool
    },
    mixins: [ReactPureRender],
    getDefaultProps: function () {
        var defaultGetter = function (allowedValue) {
            return allowedValue.toString();
        };
        return {
            getActiveStyle: R.always({}),
            getKey: defaultGetter,
            getLabel: defaultGetter,
            multi: false,
            vertical: false
        };
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
        return this.isActiveSingle(allowedValue);
    },
    onChange: function (allowedValue) {
        this.props.onChange([allowedValue]);
    },
    renderButtonOption: function (allowedValue) {
        var active = this.isActive(allowedValue);
        return (
            <components.Button
                active={active}
                disabled={allowedValue.isDisabled || false}
                key={this.props.getKey(allowedValue)}
                onClick={R.partial(this.onChange, [allowedValue])}
                style={active ? this.props.getActiveStyle(allowedValue) : styleDropdown}
            >
                {this.props.getLabel(allowedValue)}
            </components.Button>
        );
    },
    renderFilter: function () {
        return (
            <bootstrap.Input
                addonAfter={<img src={icons.iconSearch} style={{height: "21px"}}/>}
                className="input-search"
                onChange={input => this.setState({inputFilter: input.target.value})}
                placeholder="Ricerca"
                type="text"
            />
    );
    },
    render: function () {
        return (
            <bootstrap.ButtonGroup
                vertical={this.props.vertical}
            >
                {this.props.filter ? this.renderFilter() : null}
                {this.props.allowedValues.map(this.renderButtonOption)}
            </bootstrap.ButtonGroup>
        );
    }
});

module.exports = ButtonGroupSelect;
