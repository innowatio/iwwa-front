var R      = require("ramda");
var Radium = require("radium");
var React  = require("react");

import {defaultTheme} from "lib/theme";

const styles = {
    container: {
        display: "inline-block",
        position: "relative"
    },
    label: {
        position: "absolute",
        top: "-10%",
        left: "0px",
        height: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-end"
    }
};

var styleGauge = ({colors}) => ({
    fill: "none",
    stroke: colors.backgroundGauge,
    strokeWidth: "4",
    zIndex: 1
});

var styleGaugeBar = ({colors}) => ({
    fill: "none",
    stroke: colors.backgroundGaugeBar,
    strokeWidth: "4",
    zIndex: 2,
    WebkitTransition: "-webkit-transform 800ms ease",
    transition: "transform 800ms ease"
});

var stylePointer = ({colors}) => ({
    fill: colors.backgroundGaugeBar,
    WebkitTransition: "-webkit-transform 800ms ease",
    transition: "transform 800ms ease",
    zIndex: 5
});

var Gauge = React.createClass({
    propTypes: {
        maximum: React.PropTypes.number.isRequired,
        minimum: React.PropTypes.number.isRequired,
        style: React.PropTypes.object,
        styleGaugeBar: React.PropTypes.object,
        styleGaugeBody: React.PropTypes.object,
        styleLabel: React.PropTypes.object,
        stylePointer: React.PropTypes.object,
        unit: React.PropTypes.string,
        value: React.PropTypes.number.isRequired,
        valueLabel: React.PropTypes.object
    },
    contextTypes: {
        theme: React.PropTypes.object
    },
    calculateAngle: function () {
        var grad = (this.props.maximum - this.props.minimum) / 180;
        return Math.min(this.props.value / grad, 180);
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    render: function () {
        const theme = this.getTheme();
        const transform = `translate(100, 100) rotate(${this.calculateAngle()})`;
        return (
            <div style={R.merge(styles.container, this.props.style)}>
                <svg height="100%" preserveAspectRatio="none" viewBox="0 0 200 105" width="100%" >
                    <line
                        style={{stroke: theme.colors.backgroundGaugeBar, strokeWidth: "1", zIndex: "200"}}
                        x1="5"
                        x2="196"
                        y1="100"
                        y2="100"
                    />
                    <defs>
                        <clipPath id="cut-off-top">
                            <rect height="200" width="200" x="-100" y="0" />
                        </clipPath>
                    </defs>
                    {/* Gauge */}
                    <g transform={transform} >
                        <circle
                            cx="0"
                            cy="0"
                            r="95"
                            style={R.merge(styleGauge(theme), this.props.styleGaugeBody || {})}
                        />
                        <circle
                            clipPath="url(#cut-off-top)"
                            cx="0"
                            cy="0"
                            r="95"
                            style={R.merge(styleGaugeBar(theme), this.props.styleGaugeBar || {})}
                        />
                    </g>
                    <rect
                        fill={theme.colors.backgroundRealTimeSection}
                        height="10"
                        style={{zIndex: 100}}
                        width="196"
                        x="2"
                        y="100"
                    />
                    {/* Pointer */}
                    <g transform={transform} >
                        <circle
                            cx="-82.8"
                            cy="0"
                            r="3.6"
                            style={R.merge(stylePointer(theme), this.props.stylePointer || {})}
                        />
                        <path
                            d="M-85 -3 L -90 0 -85 3 Z"
                            style={R.merge(stylePointer(theme), this.props.stylePointer || {})}
                        />
                    </g>
                </svg>
                <div style={R.merge(styles.label, this.props.styleLabel || {})}>
                    {this.props.valueLabel || this.props.value}
                </div>
            </div>
        );
    }
});

module.exports = Radium(Gauge);
