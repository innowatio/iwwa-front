var R      = require("ramda");
var Radium = require("radium");
var React  = require("react");

import {defaultTheme} from "lib/theme";

var styleLabelValue = ({colors}) => ({
    color: colors.labelAmbientalSurveys,
    fontSize: ENVIRONMENT === "cordova" ? "36px" : "48px",
    fontWeight: "500",
    lineHeight: "56px",
    margin: ENVIRONMENT === "cordova" ? "0px 5px 0px 0px" : "0px 6px"
});

var styleLabelUnit = ({colors}) => ({
    color: colors.labelAmbientalSurveys,
    fontSize: ENVIRONMENT === "cordova" ? "20px" : "30px",
    marginTop: ENVIRONMENT === "cordova" ? "5px" : "0px",
    lineHeight: ENVIRONMENT === "cordova" ? "30px" : "40px",
    display: "inline-block",
    verticalAlign: "text-bottom",
    fontWeight: "500"
});

var styleTextDiv = {
    display: "flex"
};

var MeasureLabel = React.createClass({
    propTypes: {
        id: React.PropTypes.string,
        style: React.PropTypes.object,
        styleTextLabel: React.PropTypes.object,
        styleTextUnit: React.PropTypes.object,
        unit: React.PropTypes.string.isRequired,
        value: React.PropTypes.number
    },
    contextTypes: {
        theme: React.PropTypes.object
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    renderIdGauge: function () {
        const {colors} = this.getTheme();
        return (
            <div
                className="subject"
                style={{
                    fontSize: "13px",
                    lineHeight: "2px",
                    fontWeight: "400",
                    color: colors.mainFontColor
                }}
            >
                {this.props.id}
            </div>
        );
    },
    render: function () {
        const theme = this.getTheme();
        return (
            <div id="text">
                <b>
                    <div style={R.merge(styleTextDiv, this.props.style || {})}>
                        <div
                            className="labelValue"
                            style={
                                R.merge(
                                    styleLabelValue(theme),
                                    this.props.styleTextLabel || {}
                                )
                            }
                        >
                            {this.props.value}
                        </div>
                        <div>
                            <div
                                className="labelUnit"
                                style={
                                    R.merge(
                                        styleLabelUnit(theme),
                                        this.props.styleTextUnit || {}
                                    )
                                }
                            >
                                {this.props.unit}
                            </div>
                            {this.props.id ? this.renderIdGauge() : null}
                        </div>
                    </div>
                </b>
            </div>
        );
    }
});

module.exports = Radium(MeasureLabel);
