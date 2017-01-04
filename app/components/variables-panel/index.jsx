var React     = require("react");
var components = require("components");
var bootstrap       = require("react-bootstrap");

var MeasureLabel = require("components/").MeasureLabel;
import {defaultTheme} from "lib/theme";
import getLastUpdate from "lib/date-utils";

var style = (variableColor) => ({
    box: {
        maxWidth: "400px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "row",
        borderRadius: "26px",
        height: "65px",
        margin: "0 1vw",
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
            const updateTitle = getLastUpdate(variable.measurementTime);
            return (
                <div
                    key={variable.key}
                    style={{
                        width: (
                            this.props.numberOfConsumptionSensor > 3 ? "23%" : "25%"
                        ),
                        minWidth: "calc(310px + 1.3vw)",
                        flex: "1 0 auto"
                    }}
                >
                    <bootstrap.OverlayTrigger
                        overlay={<bootstrap.Tooltip id="lastUpdate" className="lastUpdate">{updateTitle}</bootstrap.Tooltip>}
                        placement="bottom"
                        rootClose={true}
                    >
                        <div style={style(variable.color).box}>
                            <components.Icon
                                color={this.getTheme().colors.iconConsumptionVariable}
                                icon={variable.icon}
                                size={"calc(45px + 1vw)"}
                                style={{
                                    lineHeight: "75px",
                                    margin: "0 .6vw",
                                    height: "65px"
                                }}
                            />
                            <MeasureLabel
                                id={variable.name || variable._id}
                                unit={variable.unit}
                                value={variable.measurementValue.toFixed(2)}
                            />
                        </div>
                    </bootstrap.OverlayTrigger>
                </div>
            );
        });
    },
    render: function () {
        return (
            <div style={{width: "100%", height: "110px", overflow: "hidden"}}>
                <div style={{display: "flex", height: "115%", overflow: "auto"}}>
                    {this.renderVariableBox()}
                </div>
            </div>
        );
    }
});

module.exports = VariablesPanel;
