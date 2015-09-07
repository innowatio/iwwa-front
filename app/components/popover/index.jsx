var Radium    = require("radium");
var React     = require("react");
var bootstrap = require("react-bootstrap");

var components = require("components/");

var Popover = React.createClass({
    propTypes: {
        arrow: React.PropTypes.string,
        children: React.PropTypes.element,
        title: React.PropTypes.element,
        tooltipId: React.PropTypes.string,
        tooltipMessage: React.PropTypes.string,
        tooltipPosition: React.PropTypes.string
    },
    getDefaultProps: function () {
        return {
            tooltipPosition: "right"
        };
    },
    addTooltip: function () {
        return (
            <bootstrap.Tooltip
                id={this.props.tooltipId}
            >
                {this.props.tooltipMessage}
            </bootstrap.Tooltip>
        );
    },
    getButton: function () {
        return (
            <components.Button bsStyle="link">
                {this.props.title}
            </components.Button>
        );
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
        return (
            <bootstrap.Popover
                animation={false}
                className="multiselect-popover"
                >
                <Radium.Style
                    rules={{
                        "": {
                            padding: "0px",
                            height: this.props.tooltipMessage === "Punti di misurazione" ? "45%" : null,
                            maxWidth: "500px",
                            left: this.props.arrow === "none" ? "37.6% !important" : null,
                            width: this.props.arrow === "none" ? "30.4%" : null,
                            borderTopLeftRadius: this.props.arrow === "none" ? "0px !important" : null,
                            borderTopRightRadius: this.props.arrow === "none" ? "0px !important" : null
                        },
                        ".popover-content": {
                            padding: "0px",
                            cursor: "pointer",
                            display: "flex",
                            height: "100%"
                        },
                        ".rw-widget": {
                            border: "0px"
                        },
                        ".rw-popup": {
                            padding: "0px"
                        },
                        ".arrow": {
                            display: this.props.arrow === "none" ? "none !important" : null
                        }
                    }}
                    scopeSelector=".multiselect-popover"
                />
                {this.props.children}
            </bootstrap.Popover>
        );
    },
    render: function () {
        return (
            <bootstrap.OverlayTrigger
                animation={false}
                overlay={this.renderOverlay()}
                placement="bottom"
                rootClose={true}
                trigger="click"
            >
                {this.getTooltipAndButton()}
            </bootstrap.OverlayTrigger>
        );
    }
});

module.exports = Radium(Popover);
