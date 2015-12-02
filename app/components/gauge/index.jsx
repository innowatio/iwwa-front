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
        top: "0px",
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
        transition: "transform 800ms ease"
};

var Gauge = React.createClass({
    propTypes: {
        maximum: React.PropTypes.number.isRequired,
        minimum: React.PropTypes.number.isRequired,
        style: React.PropTypes.object,
        styleGaugeBar: React.PropTypes.object,
        styleGaugeBody: React.PropTypes.object,
        unit: React.PropTypes.string,
        value: React.PropTypes.number.isRequired,
        valueLabel: React.PropTypes.object
    },
    calculateAngle: function () {
        var grad = (this.props.maximum - this.props.minimum) / 180;
        return Math.min(this.props.value / grad, 180);
    },
    render: function () {
        return (
            <div style={R.merge(styles.container, this.props.style)}>
                <svg height="100%" preserveAspectRatio="none" viewBox="0 0 200 100" width="100%" >
                    <defs>
                        <clipPath id="cut-off-top">
                            <rect height="200" width="200" x="-100" y="0" />
                        </clipPath>
                    </defs>
                    {/* rotate controlla la percentuale del gauge, andando da 0 a 180 */}
                    <g transform={"translate(100, 100) rotate(" + this.calculateAngle() + ")"} >
                        <circle
                            cx="0"
                            cy="0"
                            r="95"
                            style={styleGauge}
                        />
                        <circle
                            clipPath="url(#cut-off-top)"
                            cx="0"
                            cy="0"
                            r="95"
                            style={styleGaugeBar}
                        />
                        {/* r del cerchio qui sotto controlla lo spessore del gauge */}
                        <rect height="5" style={stylePointer} width="10" x="-90" y="-2.5"  />
                    </g>
                </svg>
                <div style={styles.label}>
                    {this.props.valueLabel || this.props.value}
                </div>
            </div>
        );
    }
});

module.exports = Radium(Gauge);
