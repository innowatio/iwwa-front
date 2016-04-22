import * as React from "react";
import components from "components";
import {defaultTheme} from "lib/theme";
import IPropTypes from "react-immutable-proptypes";

var SensorVariableSelector = React.createClass({
    propTypes: {
        allowedValues: React.PropTypes.oneOfType([
            React.PropTypes.array,
            IPropTypes.iterable
        ]).isRequired,
        onChange: React.PropTypes.func.isRequired,
        styleIcon: React.PropTypes.object
    },
    contextTypes: {
        theme: React.PropTypes.object
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    getSensorId: function (value) {
        var sensorId = value.get("_id");
        this.props.onChange(sensorId);
    },
    render: function () {
        const {colors} = this.getTheme();
        return (
            <components.Popover
                placement={"top"}
                title={
                    <components.Icon
                        color={colors.white}
                        icon={"option"}
                        size={"16px"}
                        style={{
                            ...this.props.styleIcon,
                            float: "right",
                            lineHeight: "10px",
                            WebkitTransform: "rotate(90deg)",
                            MsTransform: "rotate(90deg)",
                            transform: "rotate(90deg)"
                        }}
                    />
                }
            >
                <components.DropdownButton
                    allowedValues={this.props.allowedValues}
                    getColor={() => {
                        return colors.backgroundPopover;
                    }}
                    getHoverColor={() => {
                        return colors.buttonPrimary;
                    }}
                    getKey={(value) => value.get("_id")}
                    getLabel={(value) => value.get("description")}
                    onChange={this.getSensorId}
                />
            </components.Popover>
        );
    }
});

module.exports = SensorVariableSelector;
