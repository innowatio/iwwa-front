var Radium    = require("radium");
var React     = require("react");
var bootstrap = require("react-bootstrap");

var components = require("components");
var colors     = require("lib/colors");
var loginStyle = require("lib/login-modal-style");

var RequestPasswordPage = React.createClass({
    propTypes: {
        onChange: React.PropTypes.func.isRequired,
        errorMail: React.PropTypes.any
    },
    render: function () {
        return (
            <div style={loginStyle.overlay}>
                <components.StyleLogin />
                <span className="text-center" style={loginStyle.textTitlePosition}>
                    <h1 style={loginStyle.titleLabel}>{"Energia alla tua Energia"}</h1>
                    <h4 style={loginStyle.h4PasswordLostLabel}>{"Innowatio"}</h4>
                    <h4 style={loginStyle.h4PasswordLostLabel}>{"Username o Password dimenticati?"}</h4>
                </span>
                <div style={loginStyle.inputsContainer}>
                    <bootstrap.Input
                        addonBefore={<components.Icon icon="user" style={loginStyle.groupIcon}/>}
                        className="form-signin-email"
                        placeholder="Email"
                        ref="email"
                        style={loginStyle.inputLabel}
                        type="email"
                        required>
                    </bootstrap.Input>
                    <bootstrap.Button
                        block
                        className="access-button"
                        onClick={this.props.onChange}
                        style={loginStyle.accessButton}
                    >
                        {"INVIA"}
                    </bootstrap.Button>
                    {this.props.errorMail}
                    <span className="text-center" style={loginStyle.textTitlePosition}>
                        <h6 style={loginStyle.h4PasswordLostLabel}>{"Riceverai le nuove credenziali all'indirizzo e-mail indicato"}</h6>
                    </span>
                </div>
            </div>
        )
    }
});

module.exports = RequestPasswordPage;
