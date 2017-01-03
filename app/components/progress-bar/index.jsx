import * as bootstrap from "react-bootstrap";
import Radium from "radium";
import React from "react";


var ProgressBar = React.createClass({
    propTypes: {
        isDangerEnable: React.PropTypes.bool,
        isMaxVisible: React.PropTypes.bool,
        isPercentageVisible: React.PropTypes.bool,
        max: React.PropTypes.number,
        min: React.PropTypes.number,
        now: React.PropTypes.number,
        rules: React.PropTypes.object,
        style: React.PropTypes.object,
        styleMaxLabel: React.PropTypes.object,
        styleTitleLabel: React.PropTypes.object,
        title: React.PropTypes.string
    },

    renderMax: function (max) {
        if (this.props.isMaxVisible) {
            return (
                <div className="progress-max" style={this.props.styleMaxLabel}>
                    {max + " kWh"}
                </div>
            );
        }
    },
    render: function () {
        const {isPercentageVisible, isDangerEnable} = this.props;
        const DANGER_PERCENTAGE = 1;
        const max = this.props.max || 100;
        const min = this.props.min || 0;
        const now = this.props.now || 0;
        const isDanger = isDangerEnable ? (now / max) >= DANGER_PERCENTAGE : false;
        const consumptionPercent = ((now / max) * 100).toFixed(0);
        const label = isPercentageVisible ? `${consumptionPercent}% - ${now} kWh` : `${now} kWh`;
        return (
            <div className="progress-bar-main-div" >
                <div className="progress-title" style={this.props.styleTitleLabel}>
                    {this.props.title}
                </div>
                <Radium.Style
                    rules={this.props.rules}
                    scopeSelector=".progress-bar-main-div"
                />
                <bootstrap.ProgressBar
                    bsStyle={isDanger ? "danger" : "info"}
                    label={label}
                    max={max}
                    min={min}
                    now={now}
                    style={this.props.style}
                />
            {this.renderMax(max)}
            </div>
        );
    }
});

module.exports = ProgressBar;
