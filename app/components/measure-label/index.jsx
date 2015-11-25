var Radium = require("radium");
var R      = require("ramda");
var React  = require("react");

var colors = require("lib/colors");

var styleLabelValue = {
    color: colors.primary,
    fontSize: "32px"
};

var styleLabelUnit = {
    color: colors.primary,
    fontSize: "20px",
    display: "inline-block",
    verticalAlign: "top",
    height: "32px"
};

var styleTextDiv = {
    textAlign: "center"
};

var MeasureLabel = React.createClass({
    propTypes: {
        style: React.PropTypes.object,
        styleText: React.PropTypes.object,
        unit: React.PropTypes.string.isRequired,
        value: React.PropTypes.number.isRequired
    },
    render: function () {
        return (
            <div id="text" style={R.merge(styleTextDiv, this.props.style)}>
                <div className="labelValue" style={R.merge(styleLabelValue, this.props.styleText)}>
                    {this.props.value}
                    <span className="labelUnit" style={R.merge(styleLabelUnit, this.props.styleText)}>
                        {this.props.unit}
                    </span>
                </div>
            </div>
        );
    }
});

module.exports = Radium(MeasureLabel);
