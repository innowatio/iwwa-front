var R      = require("ramda");
var Radium = require("radium");
var React  = require("react");

var colors = require("lib/colors_restyling");

var styleLabelValue = {
    color: colors.primary,
    fontSize: "32px"
};

var styleLabelUnit = {
    color: colors.primary,
    fontSize: "20px",
    display: "inline-block"
};

var styleTextDiv = {
    display: "flex"
};

var MeasureLabel = React.createClass({
    propTypes: {
        id: React.PropTypes.string,
        style: React.PropTypes.object,
        styleText: React.PropTypes.object,
        unit: React.PropTypes.string.isRequired,
        value: React.PropTypes.number
    },
    render: function () {
        return (
            <div id="text">
                <b>
                    <div style={R.merge(styleTextDiv, this.props.style || {})}>
                        <div className="labelValue" style={R.merge(styleLabelValue, this.props.styleText || {})}>
                            {this.props.value}
                        </div>
                        <div>
                            <div className="labelUnit" style={R.merge(styleLabelUnit, this.props.styleText || {})}>
                                {this.props.unit}
                            </div>
                            <div className="subject" style={{fontSize: "9px"}}>
                                {this.props.id}
                            </div>
                        </div>
                    </div>
                </b>
            </div>
        );
    }
});

module.exports = Radium(MeasureLabel);
