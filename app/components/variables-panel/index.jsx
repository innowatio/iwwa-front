var bootstrap = require("react-bootstrap");
var React     = require("react");

var MeasureLabel = require("components/").MeasureLabel;
var colors       = require("lib/colors");

var style = {
    box: {
        border: "1px solid " + colors.greyBorder,
        textAlign: "center",
        margin: "1%",
        display: "flex"
    }
};

var VariablesPanel = React.createClass({
    propTypes: {
        values: React.PropTypes.arrayOf(React.PropTypes.object).isRequired
    },
    renderVariableBox: function () {
        return this.props.values.map((variable) => {
            return (
                <bootstrap.Col lg={3} md={3} sm={3} >
                    <div style={style.box} styleName="variableContainer" >
                        <img src={variable.icon} style={{width: "50px"}}/>
                        <MeasureLabel
                            unit={variable.unit}
                            value={variable.value}
                        />
                    </div>
                </bootstrap.Col>
            );
        });
    },
    render: function () {
        return (
            <div>
                {this.renderVariableBox()}
            </div>
        );
    }
});

module.exports = VariablesPanel;
