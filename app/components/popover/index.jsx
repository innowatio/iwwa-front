var Radium    = require("radium");
var React     = require("react");
var bootstrap = require("react-bootstrap");
var R         = require("ramda");

var components = require("components/");

var Popover = React.createClass({
    propTypes: {
        arrow: React.PropTypes.string,
        children: React.PropTypes.element,
        hideOnChange: React.PropTypes.bool,
        style: React.PropTypes.string,
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
    addOnClickCloseToChild: function (child) {
        var self = this;
        return React.addons.cloneWithProps(child, {
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
        return this.props.arrow === "none" ?
            <components.Button style={{width: "430px", whiteSpace: "normal"}} >
                {this.props.title}
            </components.Button> :
            <components.Button bsStyle="link">
                {this.props.title}
            </components.Button>;
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
<<<<<<< Updated upstream
                            padding: "0px",
                            height: this.props.style === "inherit" ? "calc(100vh - 420px)" : "",
                            maxWidth: "500px",
                            width: this.props.arrow === "none" ? "430px" : "",
                            marginTop: this.props.arrow === "none" ? "0px !important" : ""
=======
<<<<<<< Updated upstream
                            padding: "0px"
=======
                            padding: "0px",
                            // height: this.props.style === "inherit" ? "calc(100vh - 420px)" : "",
                            maxWidth: "500px",
                            width: this.props.arrow === "none" ? "430px" : "",
                            marginTop: this.props.arrow === "none" ? "0px !important" : ""
>>>>>>> Stashed changes
>>>>>>> Stashed changes
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
                            display: this.props.arrow === "none" ? "none" : ""
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
