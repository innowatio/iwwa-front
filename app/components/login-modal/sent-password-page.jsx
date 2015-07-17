var Radium    = require("radium");
var React     = require("react");
var bootstrap = require("react-bootstrap");

var components = require("components");
var colors     = require("lib/colors");
var loginStyle = require("components/login-modal/login-modal-style.js");

var SentPasswordPage = React.createClass({
    propTypes: {
        onChange: React.PropTypes.func.isRequired
    },
    render: function () {
        return (
            <div style={loginStyle.overlay}>
                <components.StyleLogin />
                <span className="text-center" style={loginStyle.textTitlePosition}>
                    <h1 style={loginStyle.titleLabel}>{"Energia alla tua Energia"}</h1>
                    <h4 style={loginStyle.h4PasswordLostLabel}>{"Innowatio"}</h4>
                    <h4 style={loginStyle.h4PasswordLostLabel}>
                        {"Abbiamo mandato una mail all'indirizzo selezionato per il reset della password."}
                    </h4>
                </span>
                <div style={loginStyle.inputsContainer}>
                    <bootstrap.Button
                        block
                        className="access-button"
                        onClick={this.props.onChange}
                        style={loginStyle.accessButton}
                    >
                        {"TORNA ALLA LOGIN"}
                    </bootstrap.Button>
                </div>
            </div>
        );
    }
});

module.exports = SentPasswordPage;
