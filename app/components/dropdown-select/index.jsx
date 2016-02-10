var R          = require("ramda");
var React      = require("react");
var bootstrap  = require("react-bootstrap");
var IPropTypes = require("react-immutable-proptypes");

import {defaultTheme} from "lib/theme";

var DropdownSelect = React.createClass({
    propTypes: {
        allowedValues: React.PropTypes.oneOfType([
            React.PropTypes.array,
            IPropTypes.iterable
        ]).isRequired,
        getKey: React.PropTypes.func,
        getLabel: React.PropTypes.func,
        onChange: React.PropTypes.func.isRequired,
        value: React.PropTypes.object
    },
    contextTypes: {
        theme: React.PropTypes.object
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
        // TODO: control component update in update theme.
        // FIXME: Check why this component don't change color with context.
        // See react issue: https://github.com/facebook/react/issues/2517
        return !(
            this.props.allowedValues === nextProps.allowedValues &&
            this.props.getKey === nextProps.getKey &&
            this.props.getLabel === nextProps.getLabel &&
            this.props.value === nextProps.value
        );
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    renderButtonOption: function (allowedValue, index) {
        const {colors} = this.getTheme();
        const active = R.equals(this.props.value, allowedValue);
        return (
            <bootstrap.ListGroupItem
                key={this.props.getKey(allowedValue)}
                onClick={R.partial(this.props.onChange, [allowedValue])}
                style={{
                    background: (active ? colors.primary : ""),
                    color: (active ? colors.white : colors.black),
                    borderLeft: "0px",
                    borderRight: "0px",
                    borderTop: (index === 0 ? "0px" : undefined),
                    borderTopLeftRadius: (index === 0 ? "4px" : undefined),
                    borderTopRightRadius: (index === 0 ? "4px" : undefined),
                    borderBottom: (index === 2 ? "0px" : undefined),
                    fontSize: "12px",
                    textAlign: "center"
                }}
            >
                {this.props.getLabel(allowedValue)}
            </bootstrap.ListGroupItem>
        );
    },
    render: function () {
        var items = this.props.allowedValues.map(this.renderButtonOption);
        return (
            <div>
                {items.toArray ? items.toArray() : items}
            </div>
        );
    }
});

module.exports = DropdownSelect;
