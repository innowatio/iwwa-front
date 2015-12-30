var bootstrap       = require("react-bootstrap");
var Radium          = require("radium");
var React           = require("react");

var components = require("components");
var colors     = require("lib/colors");

var FullscreenModal = React.createClass({
    propTypes: {
        childComponent: React.PropTypes.element
    },
    getInitialState: function () {
        return {
            showModal: true
        }
    },
    closeModal: function () {
        this.setState({showModal: false});
    },
    render: function () {
        return (
            <bootstrap.Modal
                className="fullscreen-modal-selector"
                show={this.state.showModal}
                onHide={this.closeModal}
            >
                <Radium.Style
                    rules={{
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
                            backgroundColor: colors.white,
                            border: "none",
                            borderRadius: "0",
                            height: "100%",
                            width: "100%"
                        }
                    }}
                    scopeSelector=".fullscreen-modal-selector"
                />
                <bootstrap.Modal.Header closeButton />
                <bootstrap.Modal.Body>
                    {this.props.childComponent}
                </bootstrap.Modal.Body>
            </bootstrap.Modal>
        );
    }
});

module.exports = Radium(FullscreenModal);
