import * as bootstrap from "react-bootstrap";
import Radium from "radium";
import React, {PropTypes} from "react";
import {merge} from "ramda";

import {styles} from "lib/styles_restyling";
import {defaultTheme} from "lib/theme";
import components from "components";
import icons from "lib/icons";

var FullscreenModal = React.createClass({
    propTypes: {
        children: PropTypes.element,
        onConfirm: PropTypes.func,
        onHide: PropTypes.func,
        onReset: PropTypes.func,
        show: PropTypes.bool
    },
    contextTypes: {
        theme: React.PropTypes.object
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    render: function () {
        const {colors} = this.getTheme();
        return (
            <bootstrap.Modal
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
                            backgroundColor: colors.backgroundFullScreenModal,
                            border: "none",
                            borderRadius: "0",
                            height: "100%",
                            width: "100%",
                            overflow: "auto"
                        },
                        ".modal-header": {
                            borderBottom: "none",
                            padding: "10px"
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
                <bootstrap.Modal.Header closeButton={true} />
                <bootstrap.Modal.Body>
                    {this.props.children}
                </bootstrap.Modal.Body>
                <bootstrap.Modal.Footer>
                    <div style={{bottom: "15px", textAlign: "center", margin: "3% auto auto auto", height: "41px"}}>
                        <components.Button
                            onClick={this.props.onConfirm}
                            style={merge(styles(this.getTheme()).buttonSelectChart, {
                                width: "275px",
                                height: "41px",
                                marginTop: "none",
                                marginRight: "none",
                                backgroundColor: colors.buttonPrimary
                            })}
                        >
                            {"OK"}
                        </components.Button>
                        <components.Button bsStyle={"link"} onClick={this.props.onReset}>
                            <img src={icons.iconReset} style={{width: "25px"}} />
                        </components.Button>
                    </div>
                </bootstrap.Modal.Footer>
            </bootstrap.Modal>
        );
    }
});

module.exports = Radium(FullscreenModal);
