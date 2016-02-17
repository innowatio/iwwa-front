import * as bootstrap from "react-bootstrap";
import Radium from "radium";
import React from "react";


var ProgressBar = React.createClass({
    propTypes: {
        max: React.PropTypes.number,
        min: React.PropTypes.number,
        now: React.PropTypes.number,
        style: React.PropTypes.object,
        title: React.PropTypes.string
    },
    render: function () {
        const DANGER_PERCENTAGE = 0.8;
        const max = this.props.max || 100;
        const min = this.props.min || 0;
        const now = this.props.now || 0;
        const isDanger = (now / max) >= DANGER_PERCENTAGE;

        return (
            <div className="progress-bar-main-div">
                <div className="progress-title">
                    {this.props.title}
                </div>
                <Radium.Style
                    rules={this.props.style || {}}
                    scopeSelector=".progress-bar-main-div"
                />
                <bootstrap.ProgressBar
                    bsStyle={isDanger ? "danger" : "info"}
                    label="%(percent)s%"
                    max={max}
                    min={min}
                    now={now}
                />
                <div className="progress-max">
                    {max + "kWh"}
                </div>
            </div>
        );
    }
});

module.exports = ProgressBar;
