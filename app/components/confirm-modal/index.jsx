import {Modal} from "react-bootstrap";
import Radium from "radium";
import React, {PropTypes} from "react";

import {defaultTheme} from "lib/theme";
import {
    Button,
    Icon
} from "components";

var ConfirmModal = React.createClass({
    propTypes: {
        backgroundColor: PropTypes.string,
        iconBgColor: PropTypes.string,
        iconType: PropTypes.string,
        onConfirm: PropTypes.func,
        onHide: PropTypes.func,
        renderFooter: PropTypes.bool,
        show: PropTypes.bool,
        subtitle: PropTypes.string,
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
            <Modal.Header
                onClick={this.props.onHide}
                style={{
                    width: "100%",
                    height: "25%",
                    textAlign: "center",
                    padding: "5%",
                    cursor: "pointer",
                    color: colors.white,
                    fontSize: "30px",
                    lineHeight: "30px",
                    textTransform: "uppercase"
                }}
            >
                <label style={{width: "100%", fontSize: "30px", fontWeight: 400}}>
                    {this.props.title}
                </label>
                <label style={{width: "100%", fontSize: "30px", fontWeight: 400}}>
                    {this.props.subtitle}
                </label>
            </Modal.Header>
        );
    },
    renderIcon: function () {
        const {colors} = this.getTheme();
        return (
            <Modal.Body
                onClick={this.props.onHide}
                style={{
                    padding:"2% 0",
                    height: "50%",
                    textAlign: "center",
                    cursor: "pointer"
                }}
            >
                <div
                    className="modal-icon"
                    style={{
                        display: "inline-block",
                        width: "300px",
                        height: "300px",
                        textAlign: "center",
                        borderRadius: "100%",
                        backgroundColor: this.props.iconBgColor || colors.backgroundConfirmIcon}}
                >
                    <Radium.Style
                        rules={{
                            "[class*='icon-']:before": {
                                lineHeight: "300px"
                            },
                            "[class^='icon-']:before, [class*=' icon-']:before": {
                                lineHeight: "300px"
                            }
                        }}
                        scopeSelector=".modal-icon"
                    />
                    <Icon
                        color={colors.white}
                        icon={this.props.iconType}
                        size={"200px"}
                        style={{
                            verticalAlign: "middle",
                            lineHeight: "300px !important"
                        }}
                    />
                </div>
            </Modal.Body>
        );
    },
    renderFooterEmpty: function () {
        return (
            <Modal.Footer
                onClick={this.props.onHide}
                style={{
                    display: "block",
                    width: "100%",
                    height: "25%",
                    cursor: "pointer"
                }}
            />
        );
    },
    renderFooter: function () {
        const {colors} = this.getTheme();
        return (
            <Modal.Footer
                onClick={this.props.onConfirm}
                style={{
                    display: "block",
                    cursor: "pointer",
                    paddingTop: "3%",
                    height: "25%"
                }}
            >
                <Button
                    bsStyle={"link"}
                    style={{fontSize: "20px", color: colors.white, width: "100%"}}
                >
                    {"MODIFICA"}
                </Button>
            </Modal.Footer>
        );
    },
    render: function () {
        const {colors} = this.getTheme();
        return (
            <Modal
                className="confirm-modal-selector"
                onHide={this.props.onHide}
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
                            backgroundColor: this.props.backgroundColor || colors.backgroundConfirmModal,
                            border: "none",
                            borderRadius: "0px",
                            height: "100%",
                            width: "100%",
                            minWidth: "768px",
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
                    scopeSelector=".confirm-modal-selector"
                />
                {this.renderHeader()}
                {this.renderIcon()}
                <div style={{clear: "both"}}></div>
                {this.props.renderFooter ? this.renderFooter() : this.renderFooterEmpty()}
            </Modal>
        );
    }
});

module.exports = Radium(ConfirmModal);
