import React, {PropTypes} from "react";
import {OverlayTrigger, Tooltip} from "react-bootstrap";

import {Button, Icon} from "components";

import {defaultTheme} from "lib/theme";

var TooltipIconButton = React.createClass({
    propTypes: {
        buttonBsStyle: PropTypes.string,
        buttonClassName: PropTypes.string,
        buttonStyle: PropTypes.object,
        icon: PropTypes.string,
        iconColor: PropTypes.string,
        iconSize: PropTypes.string,
        iconStyle: PropTypes.object,
        isButtonDisabled: PropTypes.bool,
        onButtonClick: PropTypes.func,
        tooltipId: PropTypes.string,
        tooltipPlacement: PropTypes.string,
        tooltipText: PropTypes.any,
        tooltipTrigger: PropTypes.string
    },
    contextTypes: {
        theme: PropTypes.object
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    render: function () {
        const theme = this.getTheme();
        return (
            <OverlayTrigger
                overlay={
                    <Tooltip className="buttonInfo" id={this.props.tooltipId || this.props.tooltipText}>
                        {this.props.tooltipText}
                    </Tooltip>
                }
                placement={this.props.tooltipPlacement || "bottom"}
                rootClose={true}
                trigger={this.props.tooltipTrigger}
            >
                <Button
                    bsStyle={this.props.buttonBsStyle}
                    className={this.props.buttonClassName}
                    disabled={this.props.isButtonDisabled}
                    onClick={this.props.onButtonClick}
                    style={this.props.buttonStyle}
                >
                    <Icon
                        color={this.props.iconColor || theme.colors.white}
                        icon={this.props.icon}
                        size={this.props.iconSize}
                        style={{
                            lineHeight: "20px",
                            ...this.props.iconStyle
                        }}
                    />
                </Button>
            </OverlayTrigger>
        );
    }
});

module.exports = TooltipIconButton;
