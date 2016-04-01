import React, {PropTypes} from "react";
import ReactPureRender from "react-addons-pure-render-mixin";

import components from "components";
import {defaultTheme} from "lib/theme";
import {styles} from "lib/styles_restyling";

const stylesContainer = {
    bottom: "15px",
    textAlign: "center",
    margin: "2% auto auto auto",
    height: "45px"
};

var ButtonConfirmAndReset = React.createClass({
    propTypes: {
        confirmButtonStyle: PropTypes.object,
        labelConfirmButton: PropTypes.node,
        labelResetButton: PropTypes.node,
        onConfirm: PropTypes.func,
        onReset: PropTypes.func
    },
    contextTypes: {
        theme: PropTypes.object
    },
    mixin: [ReactPureRender],
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    renderLabelReset: function () {
        const {colors} = this.getTheme();
        return (
            <components.Icon
                color={colors.iconArrow}
                icon={"reset"}
                size={"35px"}
                style={{
                    float: "right",
                    verticalAlign: "middle",
                    lineHeight: "20px"
                }}
            />
        );
    },
    renderButtonReset: function () {
        return this.props.onReset ? (
            <components.Button
                bsStyle={"link"}
                onClick={this.props.onReset}
            >
                {this.props.labelResetButton || this.renderLabelReset()}
            </components.Button>
        ) : null;
    },
    render: function () {
        return (
            <div style={stylesContainer}>
                <components.Button
                    onClick={this.props.onConfirm}
                    style={{
                        ...styles(this.getTheme()).buttonSelectChart,
                        ...this.props.confirmButtonStyle
                    }}
                >
                    {this.props.labelConfirmButton || "OK"}
                </components.Button>
                {this.renderButtonReset()}
            </div>
        );
    }
});

module.exports = ButtonConfirmAndReset;
