var bootstrap = require("react-bootstrap");
var React     = require("react");

var MeasureLabel = require("components/").MeasureLabel;
var colors       = require("lib/colors");

var style = {
    box: {
        border: "1px solid " + colors.greyBorder,
        borderRadius: "2px",
        margin: "1%",
        textAlign: "center",
        width: "21%"
    }
};

var VariablesPanel = React.createClass({
    propTypes: {
        values: React.PropTypes.arrayOf(React.PropTypes.object).isRequired
    },
    renderVariableBox: function () {
        return this.props.values.map((variable) => {
            return (
                <div key={variable.get("key")} style={style.box} styleName="variableContainer">
                    <img src={variable.get("icon")} style={{height: "50px"}}/>
                    <MeasureLabel
                        unit={variable.get("unit")}
                        value={variable.get("value")}
                    />
                </div>
            );
        });
    },
    render: function () {
        // <div style={{display: "-webkit-inline-box", overflow: "auto", width: "100%"}}>
        return (
            <div style={{display: "inline-flex", overflow: "auto", width: "100%"}}>
                {this.renderVariableBox()}
            </div>
        );
    }
});

module.exports = VariablesPanel;
