import React, {PropTypes} from "react";
import {Modal} from "react-bootstrap";
import {Style} from "radium";

import components from "components";

var NotificationModal = React.createClass({
    propTypes: {
        closeModal: PropTypes.func,
        message: PropTypes.string,
        show: PropTypes.bool
    },
    getDefaultProps: function () {
        return {
            title: "Notifica"
        };
    },
    render: function () {
        return (
            <Modal className="notification-modal" show={this.props.show}>
                <Style
                    rules={{
                        "": {
                            display: "flex !important"
                        },
                        ".modal-dialog": {
                            alignSelf: "center"
                        }
                    }}
                    scopeSelector=".notification-modal"
                />
                <Modal.Body>
                    <h3 style={{fontSize: "20px"}}>{this.props.message}</h3>
                </Modal.Body>
                <Modal.Footer style={{textAlign: "center"}}>
                    <components.Button onClick={this.props.closeModal}>
                        {"SI"}
                    </components.Button>
                    <components.Button onClick={this.props.closeModal}>
                        {"NO"}
                    </components.Button>
                </Modal.Footer>
            </Modal>
        );
    }
});

module.exports = NotificationModal;
