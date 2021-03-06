var Radium = require("radium");
var React  = require("react");

import {defaultTheme} from "lib/theme";

var TutorialAnchor = React.createClass({
    propTypes: {
        children: React.PropTypes.element,
        message: React.PropTypes.string,
        order: React.PropTypes.number,
        position: React.PropTypes.oneOf(["right", "left", "top", "bottom"])
    },
    contextTypes: {
        theme: React.PropTypes.object
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    getOptions: function () {
        return {
            element: this.refs.div,
            intro: this.props.message,
            position: this.props.position,
            order: this.props.order
        };
    },
    render: function () {
        const {colors} = this.getTheme();
        return (
            <div className="tutorial" ref="div">
                <Radium.Style
                    rules={{
                        ".introjs-helperNumberLayer": {
                            color: colors.lineReale,
                            background: colors.lineReale,
                            lineHeight: "inherit",
                            border: "0px",
                            textShadow: "none"
                        },
                        ".introjs-tooltip": {
                            maxWidth: "380px"
                        },
                        "a:focus": {
                            outline: "0px",
                            textDecoration: "none"
                        },
                        ".introjs-progressbar": {
                            backgroundColor: colors.primary
                        },
                        ".introjs-button:focus": {
                            color: colors.black
                        },
                        ".introjs-button:hover, .introjs-button:active": {
                            color: colors.primary
                        }
                    }}
                    scope-selector=".tutorial"
                />
                {this.props.children}
            </div>
        );
    }
});

module.exports = TutorialAnchor;
