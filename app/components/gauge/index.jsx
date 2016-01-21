var R      = require("ramda");
var Radium = require("radium");
var React  = require("react");

var colors = require("lib/colors");

const styles = {
    container: {
        display: "inline-block",
        position: "relative",
        width: "200px",
        height: "100px"
    },
    label: {
        position: "absolute",
        top: "-20px",
        left: "0px",
        height: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-end"
    }
};

var styleGauge = {
    fill: "none",
    stroke: colors.greyLight,
    strokeWidth: "8",
    zIndex: 1
};

var styleGaugeBar = {
    fill: "none",
    stroke: colors.primary,
    strokeWidth: "10",
    zIndex: 2,
    WebkitTransition: "-webkit-transform 800ms ease",
    transition: "transform 800ms ease"
};

var stylePointer = {
    fill: colors.darkBlack,
    WebkitTransition: "-webkit-transform 800ms ease",
    transition: "transform 800ms ease",
    zIndex: 5
};

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
    calculateAngle: function () {
        var grad = (this.props.maximum - this.props.minimum) / 180;
        return Math.min(this.props.value / grad, 180);
    },
    render: function () {
        var transform = `translate(100, 100) rotate(${this.calculateAngle()})`;
        return (
            <div style={R.merge(styles.container, this.props.style)}>
                <svg height="100%" preserveAspectRatio="none" viewBox="0 0 200 105" width="100%" >
                    <line
                        style={{stroke: colors.greyLight, strokeWidth: "3"}}
                        x1="5"
                        x2="195"
                        y1="99"
                        y2="99"
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
                            style={R.merge(styleGauge, this.props.styleGaugeBody || {})}
                        />
                        <circle
                            clipPath="url(#cut-off-top)"
                            cx="0"
                            cy="0"
                            r="95"
                            style={R.merge(styleGaugeBar, this.props.styleGaugeBar || {})}
                        />
                    </g>
                    <rect
                        fill={colors.white}
                        height="5"
                        style={{zIndex: 4}}
                        width="200"
                        x="0"
                        y="100"
                    />
                    {/* Pointer */}
                    <g transform={transform} >
                        <circle cx="-84.5" cy="0" r="3" style={R.merge(stylePointer, this.props.stylePointer || {})} />
                        <path d="M-85 -3 L -90 0 -85 3 Z" style={R.merge(stylePointer, this.props.stylePointer || {})} />
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
