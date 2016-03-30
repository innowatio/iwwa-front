import {Modal} from "react-bootstrap";
import Radium from "radium";
import React, {PropTypes} from "react";

import {styles} from "lib/styles_restyling";
import {defaultTheme} from "lib/theme";
import components from "components";

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
                    color={colors.iconClose}
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
        const {colors} = this.getTheme();
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
                            backgroundColor: colors.buttonPrimary,
                            color: colors.white
                        }}
                    >
                        {"OK"}
                    </components.Button>
                    <components.Button bsStyle={"link"} onClick={this.props.onReset}>
                        <components.Icon
                            color={colors.iconArrow}
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
        const {colors} = this.getTheme();
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
                            backgroundColor: this.props.backgroundColor || colors.backgroundModal,
                            border: "none",
                            borderRadius: "0",
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
                <Modal.Header>
                    {this.renderHeader()}
                </Modal.Header>
                <Modal.Body>
                    {this.props.children}
                </Modal.Body>
                {this.props.renderConfirmButton ? this.renderFooter() : null}
            </Modal>
        );
    }
});

module.exports = Radium(FullscreenModal);
