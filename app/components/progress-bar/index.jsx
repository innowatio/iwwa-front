import * as bootstrap from "react-bootstrap";
import Radium from "radium";
import React from "react";


var ProgressBar = React.createClass({
    propTypes: {
        max: React.PropTypes.number,
        min: React.PropTypes.number,
        now: React.PropTypes.number,
        rules: React.PropTypes.object,
        style: React.PropTypes.object,
        styleMaxLabel: React.PropTypes.object,
        styleTitleLabel: React.PropTypes.object,
        title: React.PropTypes.string
    },
    render: function () {
        const DANGER_PERCENTAGE = 0.8;
        const max = this.props.max || 100;
        const min = this.props.min || 0;
        const now = this.props.now || 0;
        const isDanger = (now / max) >= DANGER_PERCENTAGE;

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
                    label={`${now}%`}
                    max={max}
                    min={min}
                    now={now}
                    style={this.props.style}
                />
                <div className="progress-max" style={this.props.styleMaxLabel}>
                    {max + " kWh"}
                </div>
            </div>
        );
    }
});

module.exports = ProgressBar;
