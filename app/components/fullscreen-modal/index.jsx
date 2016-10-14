import {Modal} from "react-bootstrap";
import Radium from "radium";
import React, {PropTypes} from "react";

import {defaultTheme} from "lib/theme";
import components from "components";

const buttonConfirmStyle = ({colors}) => ({
    width: "275px",
    height: "50px",
    lineHeight: "45px",
    padding: "0px",
    margin: "0px",
    fontSize: "20px",
    border: "0px",
    backgroundColor: colors.buttonPrimary,
    color: colors.white
});

var FullscreenModal = React.createClass({
    propTypes: {
        backgroundColor: PropTypes.string,
        children: PropTypes.element,
        iconCloseColor: PropTypes.string,
        onConfirm: PropTypes.func,
        onHide: PropTypes.func,
        onReset: PropTypes.func,
        renderConfirmButton: PropTypes.bool,
        show: PropTypes.bool,
        title: PropTypes.string
    },
    contextTypes: {
        theme: React.PropTypes.object
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    renderHeader: function () {
        const {colors} = this.getTheme();
        return (
            <components.Button
                bsStyle={"link"}
                onClick={this.props.onHide}
                style={{
                    display: "block",
                    float: "right"
                }}
            >
                <components.Icon
                    color={this.props.iconCloseColor || colors.iconClose}
                    icon={"close"}
                    size={"60px"}
                    style={{
                        verticalAlign: "middle",
                        lineHeight: "20px"
                    }}
                />
            </components.Button>
        );
    },
    renderFooter: function () {
        const padding = this.props.onReset ? "40px" : "0px";
        return (
            <Modal.Footer style={{display: "block"}}>
                <components.ButtonConfirmAndReset
                    confirmButtonStyle={buttonConfirmStyle(this.getTheme())}
                    onConfirm={this.props.onConfirm}
                    onReset={this.props.onReset}
                />
            </Modal.Footer>
        );
    },
    render: function () {
        const {colors} = this.getTheme();
        return (
            <Modal
                className="fullscreen-modal-selector"
                children={this.props.children}
                onHide={this.props.onHide}
                onReset={this.props.onReset}
                show={this.props.show}
            >
                <Radium.Style
                    rules={{
                        ".modal-body": {
                            paddingTop: "auto",
                            height: "auto"
                        },
                        ".modal-dialog": {
                            bottom: "0px",
                            left: "0px",
                            top: "0px",
                            right: "0",
                            margin: "0px",
                            overflow: "hidden",
                            position: "fixed",
                            height: "100%",
                            width: "100%"
                        },
                        ".modal-content": {
                            backgroundColor: this.props.backgroundColor || colors.backgroundModal,
                            border: "none",
                            borderRadius: "0px",
                            height: "100%",
                            width: "100%",
                            overflow: "auto"
                        },
                        ".modal-header": {
                            borderBottom: "none",
                            padding: "0px"
                        },
                        ".modal-header span": {
                            display: "none"
                        },
                        ".modal-footer": {
                            borderTop: "none",
                            display: "initial"
                        }
                    }}
                    scopeSelector=".fullscreen-modal-selector"
                />
                <Modal.Header style={{textAlign: "center"}}>
                    <label style={{
                        color: colors.white,
                        fontSize: "30px",
                        fontWeight: 400,
                        textAlign: "center",
                        lineHeight: "60px",
                        textTransform: "uppercase"
                    }}>
                        {this.props.title}
                    </label>
                    {this.renderHeader()}
                </Modal.Header>
                <Modal.Body>
                    {this.props.children}
                </Modal.Body>
                <div style={{clear: "both"}}></div>
                {this.props.renderConfirmButton ? this.renderFooter() : null}
            </Modal>
        );
    }
});

module.exports = Radium(FullscreenModal);
