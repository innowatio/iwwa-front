var Radium    = require("radium");
var React     = require("react");
var bootstrap = require("react-bootstrap");

var components = require("components/");

var Popover = React.createClass({
    propTypes: {
        children: React.PropTypes.element,
        hideOnChange: React.PropTypes.bool,
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
    getInitialState: function () {
        return {
            isOpen: false
        };
    },
    componentDidMount: function () {
        this.state.isOpen = true;
    },
    componentWillReceiveProps: function () {
        if (!this.state.isOpen) {
            this.closePopover();
        }
    },
    addOnClickCloseToChild: function (child) {
        var self = this;
        return React.addons.cloneWithProps(child, {
            onChange: (a) => {
                child.props.onChange(a);
                self.closePopover();
            }
        });
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
    closePopover: function () {
        this.refs.menuPopover.hide();
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
                            padding: "0px"
                        },
                        ".popover-content": {
                            padding: "0px",
                            cursor: "pointer",
                            display: "flex"
                        },
                        ".rw-widget": {
                            border: "0px"
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
