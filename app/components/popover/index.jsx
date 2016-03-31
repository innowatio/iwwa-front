var bootstrap           = require("react-bootstrap");
var R                   = require("ramda");
var Radium              = require("radium");
var React               = require("react");
import {defaulTheme} from "lib/theme";

var Popover = React.createClass({
    propTypes: {
        arrow: React.PropTypes.string,
        arrowColor: React.PropTypes.string,
        children: React.PropTypes.element,
        hideOnChange: React.PropTypes.bool,
        notClosePopoverOnClick: React.PropTypes.bool,
        style: React.PropTypes.object,
        title: React.PropTypes.oneOfType([
            React.PropTypes.element,
            React.PropTypes.string
        ]),
        tooltipId: React.PropTypes.string,
        tooltipMessage: React.PropTypes.string,
        tooltipPosition: React.PropTypes.string
    },
    contextTypes: {
        theme: React.PropTypes.object
    },
    getDefaultProps: function () {
        return {
            tooltipPosition: "right"
        };
    },
    getTheme: function () {
        return this.context.theme || defaulTheme;
    },
    addOnClickCloseToChild: function (child) {
        var self = this;
        return React.cloneElement(child, {
            onChange: (a) => {
                self.closePopover();
                if (!R.isNil(child.props.onChange)) {
                    child.props.onChange(a);
                } else {
                    child.props.valueLink.requestChange(a);
                }
            }
        });
    },
    addTooltip: function () {
        return (
            <bootstrap.Tooltip
                className="tooltip-popover"
                id={this.props.tooltipId}
            >
                {this.props.tooltipMessage}
            </bootstrap.Tooltip>
        );
    },
    closePopover: function () {
        return this.props.notClosePopoverOnClick ? null : this.refs.menuPopover.hide();
    },
    getButton: function () {
        const theme = this.getTheme();
        return this.props.arrow === "none" ?
            <bootstrap.Button
                style={{
                    width: "400px",
                    whiteSpace: "normal",
                    outline: "0px",
                    outlineStyle: "none",
                    outlineWidth: "0px",
                    marginTop: "8px",
                    border: `1px solid ${theme.colors.borderSelectButton}`,
                    color: theme.colors.mainFontColor,
                    backgroundColor: theme.colors.backgroundSelectButton
                }}
            >
                {this.props.title}
            </bootstrap.Button> :
            <bootstrap.Button
                bsStyle="link"
                style={{
                    outline: "0px",
                    outlineStyle: "none",
                    outlineWidth: "0px"
                }}
            >
                {this.props.title}
            </bootstrap.Button>;
    },
    getTooltipAndButton: function () {
        var button = this.getButton();
        if (this.props.tooltipMessage) {
            return (
                <bootstrap.OverlayTrigger
                    overlay={this.addTooltip()}
                    placement={this.props.tooltipPosition}
                    rootClose={true}
                    trigger="click"
                >
                    {button}
                </bootstrap.OverlayTrigger>
            );
        }
        return button;
    },
    renderOverlay: function () {
        const {colors} = this.getTheme();
        return (
            <bootstrap.Popover
                animation={false}
                className="multiselect-popover"
                id={this.props.tooltipId + "-popover"}
                style={this.props.style}
            >
                <Radium.Style
                    rules={{
                        "": {
                            padding: "0px",
                            maxWidth: "500px",
                            backgroundColor: colors.transparent,
                            width: this.props.arrow === "none" ? "398px" : "",
                            marginTop: this.props.arrow === "none" ? "0px !important" : "",
                            boxShadow: "none",
                            WebkitBoxShadow: "none",
                            border: "0px"
                        },
                        ".popover-content": {
                            padding: "0px",
                            cursor: "pointer",
                            display: "flex",
                            height: "100%"
                        },
                        ".arrow": {
                            display: this.props.arrow === "none" ? "none" : "",
                            top: "-10px !important",
                            zIndex: "1000"
                        },
                        ".arrow, .arrow:after": {
                            borderBottomColor: colors.borderPopover + "!important"
                        },
                        ".arrow:after": {
                            borderBottomColor: this.props.arrowColor ?
                            `${this.props.arrowColor} !important` :
                            `${colors.backgroundArrowPopover} !important`
                        },
                        ".rw-widget": {
                            border: "0px",
                            outline: "none"
                        },
                        ".rw-popup": {
                            padding: "0px"
                        }
                    }}
                    scopeSelector=".multiselect-popover"
                />
                {this.props.hideOnChange ? this.addOnClickCloseToChild(this.props.children) : this.props.children}
            </bootstrap.Popover>
        );
    },
    render: function () {
        return (
            <bootstrap.OverlayTrigger
                animation={false}
                className="popover-overlay"
                overlay={this.renderOverlay()}
                placement="bottom"
                ref={"menuPopover"}
                rootClose={true}
                trigger="click"
            >
                {this.getTooltipAndButton()}
            </bootstrap.OverlayTrigger>
        );
    }
});

module.exports = Radium(Popover);
