var bootstrap  = require("react-bootstrap");
var Radium     = require("radium");
var React      = require("react");

var components = require("components");
var colors     = require("lib/colors");

var FullscreenModal = React.createClass({
    propTypes: {
        childComponent: React.PropTypes.element,
        onHide: React.PropTypes.func,
        showModal: React.PropTypes.bool
    },
    render: function () {
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
                            backgroundColor: colors.white,
                            border: "none",
                            borderRadius: "0",
                            height: "100%",
                            width: "100%"
                        },
                        ".modal-header": {
                            borderBottom: "none"
                        },
                        "button.close": {
                            fontSize: "72px",
                            fontWeight: "100",
                            color: colors.primary,
                            opacity: 1,
                            marginTop: "-10px"
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
