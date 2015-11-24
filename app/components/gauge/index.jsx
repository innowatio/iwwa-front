var Radium = require("radium");
var React  = require("react");

import {gaugeStyle} from "./rules";

var Gauge = React.createClass({
    propTypes: {
        maximum: React.PropTypes.number,
        minimum: React.PropTypes.number,
        styleGaugeBar: React.PropTypes.object,
        styleGaugeBody: React.PropTypes.object,
        value: React.PropTypes.number
    },
    render: function () {
        var percentage = this.props.value / 100;
        var degrees = 180 * percentage;
        var pointerDegrees = degrees - 90;
        return (
            <div className="gauge-container" style={{left: "100px", top: "100px", width: "100%", height: "500px"}}>
                <Radium.Style
                    rules={gaugeStyle}
                    scopeSelector=".gauge-container"
                />
                <div className="gauge-cont">
                    <div className="gauge">
                        <div className="inner"></div>
                        <div className="innerafter"></div>
                        <div
                            className="spinner"
                            style={{"transform": "rotate(" + degrees + "deg)"}}
                        />
                    </div>
                    <div
                        className="pointer"
                        style={{"transform": "rotate(" + pointerDegrees + "deg)"}}
                    ></div>
                    <div className="pointer-knob"></div>
                </div>
            </div>
        );
    }
});

module.exports = Radium(Gauge);
