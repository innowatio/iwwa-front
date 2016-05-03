var R          = require("ramda");
var Radium     = require("radium");
var React      = require("react");

var components = require("components");
import {defaultTheme} from "lib/theme";

var ConsumptionButtons = React.createClass({
    propTypes: {
        allowedValues: React.PropTypes.array.isRequired,
        onChange: React.PropTypes.func.isRequired,
        resetConsumption: React.PropTypes.func,
        selectedConsumptionValue: React.PropTypes.object,
        selectedSensorValue: React.PropTypes.string,
        style: React.PropTypes.object,
        styleButton: React.PropTypes.object,
        styleButtonSelected: React.PropTypes.object,
        styleIcon: React.PropTypes.object
    },
    contextTypes: {
        theme: React.PropTypes.object
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    getButtonOnChange: function (firstSensor, consumption, isSelected) {
        if (isSelected) {
            return this.props.resetConsumption;
        }
        return R.partial(this.props.onChange, [firstSensor, consumption]);
    },
    renderConsumptionButton: function (consumption) {
        const theme = this.getTheme();
        var isSelected = R.equals(consumption, this.props.selectedConsumptionValue);
        const firstSensor = consumption.sensors[0]["_id"];
        const consumptionButtonColor = {
            backgroundColor: consumption.color
        };
        const styleButton = R.merge(
            this.props.styleButton,
            isSelected ? this.props.styleButtonSelected : {}
        );

        return (
            <div key={consumption.key} style={{
                float:"left",
                marginLeft: "10px",
                width: styleButton.width,
                transition: styleButton.transition
            }}
            >
                <components.SensorVariableSelector
                    allowedValues={consumption.sensors}
                    onChange={R.partialRight(this.props.onChange, [consumption])}
                    styleIcon={{
                        width: styleButton.width,
                        transition: styleButton.transition
                    }}
                    value={isSelected ? this.props.selectedSensorValue : undefined}
                />
                <components.Button
                    key={consumption.key}
                    onClick={this.getButtonOnChange(firstSensor, consumption, isSelected)}
                    style={R.merge(
                        styleButton,
                        consumptionButtonColor
                    )}
                >
                    <components.Icon
                        color={consumption.iconColor}
                        icon={consumption.iconClass}
                        size={"40px"}
                        style={{
                            float:"left",
                            width: "45px",
                            textAlign: "center",
                            margin: "0",
                            padding: "0",
                            verticalAlign: "middle"
                        }}
                    />
                    <div style={{
                        textAlign: "center",
                        paddingRight: "35px",
                        lineHeight: "45px",
                        height: "45px",
                        opacity: isSelected ? "1" : "0",
                        color: theme.colors.white,
                        transition: "opacity 0.8s ease-in-out"
                    }}
                    >
                        {isSelected ? consumption.label : ""}
                    </div>
                </components.Button>
            </div>
        );
    },
    render: function () {
        return (
            <div style={this.props.style}>
                {this.props.allowedValues.map(this.renderConsumptionButton)}
            </div>
        );
    }
});

module.exports = Radium(ConsumptionButtons);
