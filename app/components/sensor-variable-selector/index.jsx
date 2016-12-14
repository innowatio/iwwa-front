import * as React from "react";
import IPropTypes from "react-immutable-proptypes";

import components from "components";
import {defaultTheme} from "lib/theme";
import {styles} from "lib/styles";

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
                style={{
                    float: "right",
                    margin: 0,
                    padding: 0,
                    width: "45px"
                }}
                styleButton={{width: "45px"}}
                title={
                    <components.Icon
                        color={theme.colors.white}
                        icon={"option-horizontal"}
                        size={"16px"}
                        style={{
                            ...this.props.styleIcon,
                            lineHeight: "10px"
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
                    getLabel={(value) => value["description"] || value["name"]}
                    onChange={this.onChangeWithSensorId}
                    value={this.props.allowedValues.find((allowedValue) => allowedValue["_id"] === this.props.value)}
                    style={styles(theme).chartDropdownButton}
                />
            </components.Popover>
        );
    }
});

module.exports = SensorVariableSelector;
