import R from "ramda";
import Radium from "radium";
import React  from "react";

import {EXEC_ENV} from "lib/config";
import {defaultTheme} from "lib/theme";

var styleLabelValue = ({colors}) => ({
    color: colors.labelAmbientalSurveys,
    fontSize: EXEC_ENV === "cordova" ? "36px" : "40px",
    fontWeight: "500",
    lineHeight: "35px",
    marginRight: "5px"
});

var styleLabelUnit = ({colors}) => ({
    color: colors.labelAmbientalSurveys,
    fontSize: EXEC_ENV === "cordova" ? "20px" : "30px",
    marginTop: EXEC_ENV === "cordova" ? "5px" : "0px",
    lineHeight: "35px",
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
    mapNumberFontSize: function (number) {
        var fontSize = "34px";
        if (number > "99") {
            fontSize = "28px";
        }
        if (number > "99.99") {
            fontSize = "24px";
        }
        if (number > "999.99") {
            fontSize = "22px";
        }
        if (number > "9999.99") {
            fontSize = "18px";
        }
        if (number > "99999.99") {
            fontSize = "16px";
        }
        return fontSize;
    },
    renderIdGauge: function () {
        const {colors} = this.getTheme();
        return (
            <div
                className="subject"
                style={{
                    fontSize: "13px",
                    fontWeight: "400",
                    color: colors.mainFontColor,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                }}
            >
                {this.props.id}
            </div>
        );
    },
    render: function () {
        const theme = this.getTheme();
        const fontSize = this.mapNumberFontSize();
        console.log(fontSize);
        return (
            <div id="text" style={{margin: "5px 0", width: "calc(100% - 85px)"}}>
                <div style={R.merge(styleTextDiv, this.props.style || {})}>
                    <div
                        className="labelValue"
                        style={
                            R.merge(
                                fontSize,
                                styleLabelValue(theme),
                                this.props.styleTextLabel || {}
                            )
                        }
                    >
                        {this.props.value}
                    </div>
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
                </div>
                <div style={{height: "20px"}}>
                    {this.props.id ? this.renderIdGauge() : null}
                </div>
            </div>
        );
    }
});

module.exports = Radium(MeasureLabel);
