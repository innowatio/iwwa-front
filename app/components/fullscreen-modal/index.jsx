import {Modal} from "react-bootstrap";
import Radium from "radium";
import React, {PropTypes} from "react";

import {defaultTheme} from "lib/theme";
import components from "components";
import icons from "lib/icons";

const buttonConfirmStyle = ({colors}) => ({
    width: "275px",
    height: "45px",
    lineHeight: "45px",
    padding: "0",
    marginTop: "none",
    fontSize: "20px",
    marginRight: "none",
    border: "0px",
    backgroundColor: colors.buttonPrimary
});

var FullscreenModal = React.createClass({
    propTypes: {
        backgroundColor: PropTypes.string,
        children: PropTypes.element,
        onConfirm: PropTypes.func,
        onHide: PropTypes.func,
        onReset: PropTypes.func,
        renderConfirmButton: PropTypes.bool,
        show: PropTypes.bool
    },
    contextTypes: {
        theme: React.PropTypes.object
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    renderFooter: function () {
        return (
            <Modal.Footer>
                <components.ButtonConfirmAndReset
                    confirmButtonStyle={buttonConfirmStyle(this.getTheme())}
                    onConfirm={this.props.onConfirm}
                    onReset={this.props.onReset}
                />
            </Modal.Footer>
        );
    },
    render: function () {
        return (
            <Modal
                className="fullscreen-modal-selector"
                {...this.props}
            >
                <Radium.Style
                    rules={{
                        ".modal-body": {
                            paddingTop: 0
                        },
                        ".modal-dialog": {
                            bottom: "0",
                            left: "0",
                            top: "0",
                            right: "0",
                            margin: "0",
                            overflow: "hidden",
                            position: "fixed",
                            height: "100%",
                            width: "100%"
                        },
                        ".modal-content": {
                            backgroundColor: this.props.backgroundColor || this.getTheme().colors.backgroundModal,
                            border: "none",
                            borderRadius: "0",
                            height: "100%",
                            width: "100%",
                            overflow: "auto"
                        },
                        ".modal-header": {
                            borderBottom: "none",
                            padding: "8px"
                        },
                        ".modal-footer": {
                            borderTop: "none",
                            display: "initial"
                        },
                        "button.close": {
                            height: "40px",
                            width: "40px",
                            backgroundImage: `url(${icons.iconClose})`,
                            backgroundSize: "100% 100%",
                            backgroundRepeat: "no-repeat",
                            opacity: 1,
                            outline: "none"
                        },
                        "button.close > span": {
                            display: "none"
                        }
                    }}
                    scopeSelector=".fullscreen-modal-selector"
                />
                <Modal.Header closeButton={true} />
                <Modal.Body>
                    {this.props.children}
                </Modal.Body>
                {this.props.renderConfirmButton ? this.renderFooter() : null}
            </Modal>
        );
    }
});

module.exports = Radium(FullscreenModal);
