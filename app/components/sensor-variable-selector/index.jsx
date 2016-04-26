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
        styleIcon: React.PropTypes.object,
        value: React.PropTypes.string
    },
    contextTypes: {
        theme: React.PropTypes.object
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    onChangeWithSensorId: function (value) {
        var sensorId = value["_id"];
        this.props.onChange(sensorId);
    },
    render: function () {
        const theme = this.getTheme();
        return (
            <components.Popover
                hideOnChange={true}
                placement={"top"}
                title={
                    <components.Icon
                        color={theme.colors.white}
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
                        return theme.colors.backgroundPopover;
                    }}
                    getHoverColor={() => {
                        return theme.colors.buttonPrimary;
                    }}
                    getKey={(value) => value["_id"]}
                    getLabel={(value) => value["description"]}
                    onChange={this.onChangeWithSensorId}
                    value={this.props.allowedValues.find((allowedValue) => allowedValue["_id"] === this.props.value)}
                />
            </components.Popover>
        );
    }
});

module.exports = SensorVariableSelector;
