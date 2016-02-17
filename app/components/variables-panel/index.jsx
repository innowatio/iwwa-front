var React     = require("react");
var components = require("components");

var MeasureLabel = require("components/").MeasureLabel;
import {defaultTheme} from "lib/theme";

var style = ({colors}) => ({
    box: {
        border: "1px solid " + colors.greyBorder,
        borderRadius: "40px",
        display: "flex",
        margin: "5%",
        padding: "2% 1%"
    }
});

var VariablesPanel = React.createClass({
    propTypes: {
        values: React.PropTypes.oneOfType([
            React.PropTypes.arrayOf(React.PropTypes.object),
            React.PropTypes.object
        ]).isRequired
    },
    contextTypes: {
        theme: React.PropTypes.object
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    renderVariableBox: function () {
        const theme = this.getTheme();
        return this.props.values.map((variable) => {
            return (
                <div  key={variable.get("key")} style={{width: "25%", flex: "1 0 auto"}}>
                    <div style={style(theme).box} styleName="variableContainer">
                        <components.Icon
                            color={this.getTheme().colors.iconVariable}
                            icon={variable.get("icon")}
                            size={"40px"}
                            style={{lineHeight: "20px", width: "45px"}}
                        />
                        <MeasureLabel
                            id={variable.get("id")}
                            style={{paddingLeft: "10px", lineHeight: "40px"}}
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
