import React, {PropTypes} from "react";
import * as bootstrap from "react-bootstrap";
import ReactDOM from "react-dom";
import {isNil} from "ramda";
import {Style} from "radium";
import {upperCaseFirst} from "change-case";
import components from "components";
import {defaulTheme} from "lib/theme";

const styles = ({colors}) => ({
    button: {
        whiteSpace: "normal",
        border: `1px solid ${colors.borderSelectButton}`,
        color: colors.mainFontColor,
        backgroundColor: colors.backgroundSelectButton
    }
});

var Popover = React.createClass({
    propTypes: {
        addOnClickCloseToChild: PropTypes.func,
        arrow: PropTypes.string,
        arrowColor: PropTypes.string,
        children: PropTypes.element,
        hideOnChange: React.PropTypes.bool,
        notClosePopoverOnClick: React.PropTypes.bool,
        placement: PropTypes.string,
        style: PropTypes.object,
        styleButton: PropTypes.object,
        title: PropTypes.node
    },
    contextTypes: {
        theme: PropTypes.object
    },
    getInitialState: function () {
        return {
            show: false
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
                if (!isNil(child.props.onChange)) {
                    child.props.onChange(a);
                } else {
                    child.props.valueLink.requestChange(a);
                }
            }
        });
    },
    closePopover: function () {
        this.setState({show: false});
    },
    onHide: function () {
        this.setState({show: false});
    },
    onOpenOverlay: function () {
        this.setState({show: true});
    },
    renderButton: function () {
        const theme = this.getTheme();
        return (
            <components.Button
                bsStyle="link"
                onClick={this.onOpenOverlay}
                style={{
                    ...styles(theme).button,
                    ...this.props.styleButton
                }}
            >
                {this.props.title}
            </components.Button>
        );
    },
    renderOverlayChildren: function () {
        const {colors} = this.getTheme();
        const placement = "border" + upperCaseFirst(this.props.placement || "bottom") + "Color";
        var arrowStyle = {};
        arrowStyle[placement] = colors.borderPopover + "!important";
        var arrowAfterStyle = {};
        arrowAfterStyle[placement] = this.props.arrowColor ?
            `${this.props.arrowColor} !important` :
            `${colors.backgroundArrowPopover} !important`;
        return (
            <bootstrap.Popover
                className="multiselect-popover"
                id="popover"
            >
                <Style
                    rules={{
                        "": {
                            ...this.props.style,
                            borderRadius: "6px",
                            width: "150px",
                            boxShadow: "none",
                            WebkitBoxShadow: "none",
                            padding: "0px",
                            border: "0px",
                            backgroundColor: colors.transparent
                        },
                        ".popover-content": {
                            padding: "0px",
                            cursor: "pointer",
                            height: "100%",
                            marginLeft: "-95px",
                            borderRadius: "6px",
                            backgroundColor: colors.backgroundDropdown
                        },
                        ".arrow": {
                            display: this.props.arrow === "none" ? "none" : "",
                            zIndex: "1000",
                            left: "95px"
                        },
                        ".arrow, .arrow:after": arrowStyle,
                        ".arrow:after": arrowAfterStyle,
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
            <div style={{...this.props.style, position: "relative", width: "auto"}}>
                <div ref="buttonOverlay">
                    {this.renderButton()}
                </div>
                <bootstrap.Overlay
                    container={this}
                    onHide={this.onHide}
                    placement={this.props.placement || "bottom"}
                    rootClose={true}
                    show={this.state.show}
                    target={() => ReactDOM.findDOMNode(this.refs.buttonOverlay)}
                >
                    {this.renderOverlayChildren()}
                </bootstrap.Overlay>
            </div>
        );
    }
});


module.exports = Popover;
