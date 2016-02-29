import {Modal} from "react-bootstrap";
import Radium from "radium";
import React, {PropTypes} from "react";

import {styles} from "lib/styles_restyling";
import {defaultTheme} from "lib/theme";
import components from "components";
import icons from "lib/icons";

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
                <div style={{bottom: "15px", textAlign: "center", margin: "2% auto auto auto", height: "45px"}}>
                    <components.Button
                        onClick={this.props.onConfirm}
                        style={{
                            ...styles(this.getTheme()).buttonSelectChart,
                            width: "275px",
                            height: "45px",
                            lineHeight: "45px",
                            padding: "0",
                            marginTop: "none",
                            fontSize: "20px",
                            marginRight: "none",
                            border: "0px",
                            backgroundColor: this.getTheme().colors.buttonPrimary
                        }}
                    >
                        {"OK"}
                    </components.Button>
                    <components.Button bsStyle={"link"} onClick={this.props.onReset}>
                        <components.Icon
                            color={this.getTheme().colors.iconArrow}
                            icon={"reset"}
                            size={"35px"}
                            style={{
                                float: "right",
                                verticalAlign: "middle",
                                lineHeight: "20px"
                            }}
                        />
                    </components.Button>
                </div>
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
