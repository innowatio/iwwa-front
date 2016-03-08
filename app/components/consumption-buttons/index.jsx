var bootstrap  = require("react-bootstrap");
var R          = require("ramda");
var Radium     = require("radium");
var React      = require("react");

var components = require("components");
import {defaultTheme} from "lib/theme";

var ConsumptionButtons = React.createClass({
    propTypes: {
        allowedValues: React.PropTypes.array.isRequired,
        onChange: React.PropTypes.func.isRequired,
        selectedValue: React.PropTypes.object,
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
    renderConsumptionButton: function (consumption) {
        const theme = this.getTheme();
        var isSelected = R.equals(consumption, this.props.selectedValue);
        const consumptionButtonColor = {
            backgroundColor: consumption.color
        };
        return (
            <components.Button
                key={consumption.key}
                onClick={R.partial(this.props.onChange, [consumption])}
                style={R.merge(
                    R.merge(
                        this.props.styleButton,
                        isSelected ? this.props.styleButtonSelected : {}
                    ),
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
                <div className="text-button">
                    <Radium.Style
                        rules={{
                            "span": {
                                textAlign: "center",
                                paddingRight: "35px",
                                lineHeight: "45px",
                                height: "45px",
                                color: theme.colors.mainFontColor,
                                transition: "opacity 0.9s ease-in",
                                transitionDelay: "1s"
                            }
                        }}
                        scopeSelector=".text-button"
                    />
                {isSelected ? consumption.label : ""}
                </div>
            </components.Button>
        );
    },
    render: function () {
        return (
            <bootstrap.ButtonGroup style={this.props.style}>
                {this.props.allowedValues.map(this.renderConsumptionButton)}
            </bootstrap.ButtonGroup>
        );
    }
});

module.exports = Radium(ConsumptionButtons);
