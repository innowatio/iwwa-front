var Radium = require("radium");
var React  = require("react");

var styleGauge = {
    fill: "#ffffff",
    stroke: "#cccccc",
    strokeWidth: "8"
};

var styleGaugeBar = {
    fill: "#ffffff",
    stroke: "#66ff84",
    strokeWidth: "10"
};


var Gauge = React.createClass({
    propTypes: {
        maximum: React.PropTypes.number,
        minimum: React.PropTypes.number,
        styleGaugeBar: React.PropTypes.object,
        styleGaugeBody: React.PropTypes.object,
        value: React.PropTypes.number
    },
    calculateAngle: function () {
        var grad = (this.props.maximum - this.props.minimum) / 180;
        return this.props.value / grad;
    },
    render: function () {
        // var percentage = this.props.value / 100;
        // var degrees = 180 * percentage;
        // var pointerDegrees = degrees - 90;
        return (
            <div id="container">
                <svg width="200" height="100">
                    <defs>
                        <clipPath id="cut-off-top">
                            <rect x="-100" y="0" width="200" height="200" />
                        </clipPath>
                        <clipPath id="cut-off-bottom">
                            <rect x="-100" y="-200" width="200" height="200" />
                        </clipPath>
                    </defs>

                    {/* rotate controlla la percentuale del gauge, andando da 0 a 180 */}
                    <g transform={"translate(100, 100) rotate(" + this.calculateAngle() + ")"}>
                        <circle
                            cx="0"
                            cy="0"
                            r="95"
                            fill="#66ff84"
                            style={styleGaugeBar}
                            clipPath="url(#cut-off-top)"
                        />
                        <circle
                            cx="0"
                            cy="0"
                            r="95"
                            fill="#aaaaaa"
                            style={styleGauge}
                            clipPath="url(#cut-off-bottom)"
                        />
                        {/* r del cerchio qui sotto controlla lo spessore del gauge
                        <circle cx="0" cy="0" r="90" fill="#ffffff" />*/}
                        <rect fill="black" width="10" height="5" y="-2.5" x="-90" />
                    </g>
                </svg>
            </div>
        );
    }
});

module.exports = Radium(Gauge);
