import React from "react";
import * as bootstrap from "react-bootstrap";
import R from "ramda";
import IPropTypes from "react-immutable-proptypes";

import {defaultTheme} from "lib/theme";

var DropdownSelect = React.createClass({
    propTypes: {
        allowedValues: React.PropTypes.oneOfType([
            React.PropTypes.array,
            IPropTypes.iterable
        ]).isRequired,
        arrow: React.PropTypes.string,
        arrowColor: React.PropTypes.string,
        getHoverColor: React.PropTypes.func,
        getKey: React.PropTypes.func,
        getLabel: React.PropTypes.func,
        onChange: React.PropTypes.func.isRequired,
        style: React.PropTypes.object,
        title: React.PropTypes.string,
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
            getHoverColor: defaultGetter,
            getKey: defaultGetter,
            getLabel: defaultGetter
        };
    },
    getInitialState: function () {
        return {
            allowedValue: this.props.value || {}
        };
    },
    // shouldComponentUpdate: function (nextProps) {
    //     // TODO: control component update in update theme.
    //     // FIXME: Check why this component don't change color with context.
    //     // See react issue: https://github.com/facebook/react/issues/2517
    //     return !(
    //         this.props.allowedValues === nextProps.allowedValues &&
    //         this.props.getKey === nextProps.getKey &&
    //         this.props.getLabel === nextProps.getLabel &&
    //         this.props.value === nextProps.value
    //     );
    // },
    getTheme: function () {
        return this.context.theme || defaultTheme;
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
                colors.buttonPrimary : colors.backgroundDropdown),
            color: (this.isActive(allowedValue) ?
                colors.white : colors.textDropdown)
        };
        const last = (index === this.props.allowedValues.length - 1);
        return (
            <bootstrap.ListGroupItem
                key={this.props.getKey(allowedValue)}
                onClick={R.partial(this.props.onChange, [allowedValue])}
                onMouseLeave={this.mouseLeave}
                onMouseOver={R.partial(this.mouseOver, [allowedValue])}
                style={{
                    ...itemStyle,
                    borderLeft: "0px",
                    borderRight: "0px",
                    borderTop: "0px",
                    borderBottom: (last ? "0px" : undefined),
                    fontSize: "15px",
                    fontWeight: "300",
                    marginBottom: "0px",
                    padding: "2px 10px !important",
                    verticalAlign: "middle",
                    outline: "0px",
                    outlineStyle: "none",
                    outlineWidth: "0px",
                    // This should overwrite the style over that position.
                    ...this.props.style
                }}
            >
                {this.props.getLabel(allowedValue)}
            </bootstrap.ListGroupItem>
        );
    },
    renderTitle: function (allowedValue) {
        const {colors} = this.getTheme();
        const active = R.equals(this.props.value, allowedValue);
        return (
            <h5 style={{
                color: (active ? colors.white : colors.mainFontColor),
                fontSize: "18px",
                padding: "15px 10px",
                marginBottom: "0px",
                textAlign: "left",
                cursor: "default",
                borderBottom: "1px solid " + colors.borderDropdown
            }}>
                {this.props.title}
            </h5>
        );
    },
    render: function () {
        const {colors} = this.getTheme();
        var items = this.props.allowedValues.map(this.renderButtonOption);
        return (
            <div style={{
                borderRadius: "6px",
                overflow: "hidden",
                border: "1px solid " + colors.borderDropdown
            }}>
                {this.props.title ? this.renderTitle() : null}
                {items.toArray ? items.toArray() : items}
            </div>
        );
    }
});

module.exports = DropdownSelect;
