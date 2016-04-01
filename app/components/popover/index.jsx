import React, {PropTypes} from "react";
import * as bootstrap from "react-bootstrap";
import ReactDOM from "react-dom";
import {isNil} from "ramda";
import {Style} from "radium";

import components from "components";
import {defaultTheme} from "lib/theme";

const styles = ({colors}) => ({
    button: {
        width: "400px",
        whiteSpace: "normal",
        marginTop: "8px",
        border: `1px solid ${colors.borderSelectButton}`,
        color: colors.mainFontColor,
        backgroundColor: colors.backgroundSelectButton
    },
    overlayContainer: {
        position: "relative",
        boxShadow: "0 5px 10px rgba(0, 0, 0, 0.2)",
        borderRadius: "3px",
        marginLeft: "-5px",
        marginTop: "5px",
        zIndex: 1000
    }
});

var Popover = React.createClass({
    propTypes: {
        arrow: PropTypes.string,
        arrowColor: PropTypes.string,
        children: PropTypes.element,
        hideOnChange: React.PropTypes.bool,
        notClosePopoverOnClick: React.PropTypes.bool,
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
        return this.context.theme || defaultTheme;
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
        return this.props.arrow === "none" ? (
            <components.Button onClick={this.onOpenOverlay} style={styles(theme).button} >
                {this.props.title}
            </components.Button>
        ) : (
            <components.Button bsStyle="link" onClick={this.onOpenOverlay} >
                {this.props.title}
            </components.Button>
        );
    },
    renderOverlayChildren: function () {
        const {colors} = this.getTheme();
        return (
            <bootstrap.Popover
                animation={false}
                className="multiselect-popover"
                id={"popover"}
            >
                <Style
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
            <div style={{position: "relative"}}>
                <div ref="buttonOverlay">
                    {this.renderButton()}
                </div>
                <bootstrap.Overlay
                    animation={false}
                    container={this}
                    onHide={this.onHide}
                    placement="bottom"
                    rootClose={true}
                    show={this.state.show}
                    target={() => ReactDOM.findDOMNode(this.refs.buttonOverlay)}
                >
                    <div style={styles(this.getTheme()).overlayContainer}>
                        {this.renderOverlayChildren()}
                    </div>
                </bootstrap.Overlay>
            </div>
        );
    }
});

module.exports = Popover;
