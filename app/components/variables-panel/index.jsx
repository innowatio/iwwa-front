var React     = require("react");
var components = require("components");

var MeasureLabel = require("components/").MeasureLabel;
import {defaultTheme} from "lib/theme";
import {EXEC_ENV} from "lib/config";

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
                        width: (
                            EXEC_ENV === "cordova" ?
                            (this.props.numberOfConsumptionSensor > 3 ? "30%" : "33%") :
                            (this.props.numberOfConsumptionSensor > 3 ? "23%" : "25%")
                        ),
                        flex: "1 0 auto"
                    }}
                >
                    <div style={style(variable.get("color")).box} styleName="variableContainer">
                        <components.Icon
                            color={this.getTheme().colors.iconConsumptionVariable}
                            icon={variable.get("icon")}
                            size={EXEC_ENV === "cordova" ? "48px" : "60px"}
                            style={{
                                lineHeight: EXEC_ENV === "cordova" ? "70px" : "20px",
                                width: EXEC_ENV === "cordova" ? "30px" : "45px",
                                verticalAlign: "middle"
                            }}
                        />
                        <MeasureLabel
                            id={variable.get("id")}
                            style={{
                                paddingLeft: "16px",
                                verticalAlign: "text-top",
                                minWidth: EXEC_ENV === "cordova" ? "40px" : "45px"
                            }}
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
                <div style={{display: "flex", height: "115%", overflow: "auto"}}>{this.renderVariableBox()}</div>
            </div>
        );
    }
});

module.exports = VariablesPanel;
