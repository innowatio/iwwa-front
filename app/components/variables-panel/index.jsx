var React     = require("react");
var components = require("components");

var MeasureLabel = require("components/").MeasureLabel;
import {defaultTheme} from "lib/theme";

var style = (variableColor) => ({
    box: {
        borderRadius: "28px",
        display: "flex",
        height: "65px",
        margin: "5%",
        padding: "1% 5%",
        background: variableColor
    }
});

var VariablesPanel = React.createClass({
    propTypes: {
        numberOfConsumptionSensor: React.PropTypes.number,
        values: React.PropTypes.oneOfType([
            React.PropTypes.arrayOf(React.PropTypes.object),
            React.PropTypes.object
        ]).isRequired
    },
    contextTypes: {
        theme: React.PropTypes.object
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    renderVariableBox: function () {
        return this.props.values.map((variable) => {
            return (
                <div
                    key={variable.get("key")}
                    style={{
                        width: this.props.numberOfConsumptionSensor > 4 ? "24%" : "25%",
                        flex: "1 0 auto"
                    }}
                >
                    <div style={style(variable.get("color")).box} styleName="variableContainer">
                        <components.Icon
                            color={this.getTheme().colors.iconVariable}
                            icon={variable.get("icon")}
                            size={"60px"}
                            style={{lineHeight: "20px", width: "45px"}}
                        />
                        <MeasureLabel
                            id={variable.get("id")}
                            style={{paddingLeft: "10px", verticalAlign: "text-top"}}
                            unit={variable.get("unit")}
                            value={variable.get("value")}
                        />
                    </div>
                </div>
            );
        });
    },
    render: function () {
        return (
            <div style={{width: "100%", height: "110px", overflow: "hidden"}}>
                <div style={{display: "flex", height: "100%", overflow: "auto"}}>{this.renderVariableBox()}</div>
            </div>
        );
    }
});

module.exports = VariablesPanel;
