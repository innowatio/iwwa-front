var Radium = require("radium");
var React  = require("react");

var colors       = require("lib/colors");
var MeasureLabel = require("../measure-label");

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
        styleGaugeBar: React.PropTypes.object,
        styleGaugeBody: React.PropTypes.object,
        value: React.PropTypes.number.isRequired
    },
    calculateAngle: function () {
        var grad = (this.props.maximum - this.props.minimum) / 180;
        return this.props.value / grad;
    },
    render: function () {
        return (
            <div id="container" style={{width: "200px"}}>
                <svg height="100" width="200">
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
                <MeasureLabel
                    style={{
                        position: "relative",
                        top: "-40px"
                    }}
                    unit={"UNIT"}
                    value={this.props.value}
                />
            </div>
        );
    }
});

module.exports = Radium(Gauge);
