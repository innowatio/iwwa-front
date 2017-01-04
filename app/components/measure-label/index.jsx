import R from "ramda";
import Radium from "radium";
import React  from "react";

import {defaultTheme} from "lib/theme";

var styleLabelValue = ({colors}) => ({
    color: colors.labelAmbientalSurveys,
    fontSize: "calc(30px + 1vw)",
    marginRight: "5px",
    fontWeight: "500",
    lineHeight: "35px"
});

var styleLabelUnit = ({colors}) => ({
    color: colors.labelAmbientalSurveys,
    fontSize: "calc(18px + 1vw)",
    marginTop: "4px",
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
        return (
            <div
                id="text"
                style={{margin: "5px 0", width: "calc(100% - 90px)", minWidth: "220px"}}
            >
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
