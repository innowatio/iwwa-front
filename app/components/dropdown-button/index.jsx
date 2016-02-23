var R          = require("ramda");
var React      = require("react");
var bootstrap  = require("react-bootstrap");
var IPropTypes = require("react-immutable-proptypes");
var components = require("components/");

import {defaultTheme} from "lib/theme";

var DropdownButton = React.createClass({
    propTypes: {
        allowedValues: React.PropTypes.oneOfType([
            React.PropTypes.array,
            IPropTypes.iterable
        ]).isRequired,
        getColor: React.PropTypes.func,
        getIcon: React.PropTypes.func,
        getKey: React.PropTypes.func,
        getLabel: React.PropTypes.func,
        onChange: React.PropTypes.func,
        style: React.PropTypes.object,
        value: React.PropTypes.any
    },
    contextTypes: {
        theme: React.PropTypes.object
    },
    getDefaultProps: function () {
        var defaultGetter = function (allowedItem) {
            return allowedItem.toString();
        };
        return {
            getColor: defaultGetter,
            getKey: defaultGetter,
            getLabel: defaultGetter,
            getIcon: defaultGetter
        };
    },
    getInitialState: function () {
        return {
            allowedValue: {}
        };
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    imageItem: function (allowedValue) {
        if (R.keys(allowedValue).length > 2) {
            return (
                <components.Icon
                    color={this.props.getColor(allowedValue)}
                    icon={this.props.getIcon(allowedValue)}
                    size={"35px"}
                    style={{
                        lineHeight: "28px",
                        verticalAlign: "text-top",
                        marginRight: "10px"
                    }}
                />
            );
        }
    },
    mouseOver: function (item) {
        this.setState({
            allowedValue: item
        });
    },
    mouseLeave: function () {
        this.setState({allowedValue: {}});
    },
    renderButtonOption: function (allowedValue, index) {
        return (
            <bootstrap.ListGroupItem
                key={this.props.getKey(allowedValue)}
                onClick={R.partial(this.props.onChange, [allowedValue])}
                onMouseLeave={this.mouseLeave}
                onMouseOver={R.partial(this.mouseOver, [allowedValue])}
                style={R.merge({
                    borderLeft: "0px",
                    borderRight: "0px",
                    borderTop: (index === 0 ? "0px" : undefined),
                    borderTopLeftRadius: (index === 0 ? "4px" : undefined),
                    borderTopRightRadius: (index === 0 ? "4px" : undefined),
                    borderBottom: (index === 2 ? "0px" : undefined),
                    fontSize: "12px",
                    lineHeight: "45px",
                    padding: "2px 20px 2px 10px !important",
                    verticalAlign: "middle",
                    // This should overwrite the style over that position.
                    ...this.props.style
                }, {
                    backgroundColor: R.equals(
                        this.state.allowedValue, allowedValue) ?
                        this.getTheme().colors.buttonPrimary :
                        this.getTheme().colors.transparent
                })}
            >
                {this.imageItem(allowedValue)}
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

module.exports = DropdownButton;
