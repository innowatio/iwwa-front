var R          = require("ramda");
var React      = require("react");
var bootstrap  = require("react-bootstrap");
var IPropTypes = require("react-immutable-proptypes");
var components = require("components");

import {defaultTheme} from "lib/theme";

var DropdownButton = React.createClass({
    propTypes: {
        allowedValues: React.PropTypes.oneOfType([
            React.PropTypes.array,
            IPropTypes.iterable
        ]).isRequired,
        getColor: React.PropTypes.func,
        getHoverColor: React.PropTypes.func,
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
            getHoverColor: defaultGetter,
            getKey: defaultGetter,
            getLabel: defaultGetter,
            getIcon: defaultGetter
        };
    },
    getInitialState: function () {
        return {
            allowedValue: this.props.value || {}
        };
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    getColor: function (allowedValue) {
        return (
            this.props.getHoverColor && this.isActive(allowedValue) ?
            this.props.getHoverColor(allowedValue) :
            this.props.getColor(allowedValue)
        );
    },
    imageItem: function (allowedValue) {
        if (R.keys(allowedValue).length > 2) {
            return (
                <components.Icon
                    color={this.getColor(allowedValue)}
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
    isActive: function (allowedValue) {
        return R.equals(this.state.allowedValue, allowedValue);
    },
    mouseOver: function (item) {
        this.setState({
            allowedValue: item
        });
    },
    mouseLeave: function () {
        this.setState({allowedValue: this.props.value || {}});
    },
    renderButtonOption: function (allowedValue, index) {
        const {colors} = this.getTheme();
        const itemStyle = {
            backgroundColor: (this.isActive(allowedValue) ?
                colors.buttonPrimary : colors.transparent),
            color: (this.isActive(allowedValue) ?
                colors.white : colors.textDropdown)
        };
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
                    outline: "0px",
                    outlineStyle: "none",
                    outlineWidth: "0px",
                    // This should overwrite the style over that position.
                    ...this.props.style
                }, itemStyle)}
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
