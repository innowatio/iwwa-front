var React     = require("react");

var MeasureLabel = require("components/").MeasureLabel;
var colors       = require("lib/colors");

var style = {
    box: {
        border: "1px solid " + colors.greyBorder,
        borderRadius: "2px",
        margin: "5%",
        textAlign: "center"
    }
};

var VariablesPanel = React.createClass({
    propTypes: {
        values: React.PropTypes.arrayOf(React.PropTypes.object).isRequired
    },
    renderVariableBox: function () {
        return this.props.values.map((variable) => {
            return (
                <div style={{width: "25%", flex: "1 0 auto"}}>
                    <div key={variable.get("key")} style={style.box} styleName="variableContainer">
                        <img src={variable.get("icon")} style={{height: "50px"}}/>
                        <MeasureLabel
                            unit={variable.get("unit")}
                            value={variable.get("value")}
                        />
                    </div>
                </div>
            );
        });
    },
    render: function () {
        return (
            <div style={{display: "flex", overflow: "auto"}}>
                {this.renderVariableBox()}
            </div>
        );
    }
});

module.exports = VariablesPanel;
