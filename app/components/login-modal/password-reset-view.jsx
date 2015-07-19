var color     = require("color");
var Radium    = require("radium");
var React     = require("react");
var bootstrap = require("react-bootstrap");

var components = require("components");
var colors     = require("lib/colors");

var styles = {
    inputs: {
        borderRadius: "4px",
        overflow: "hidden"
    },
    button: {
        background: colors.primary,
        color: colors.white
    },
    errorAlert: {
        marginTop: "16px",
        textAlign: "center"
    }
};

var PasswordResetView = React.createClass({
    propTypes: {
        asteroid: React.PropTypes.object.isRequired
    },
    getInitialState: function () {
        return {
            emailSent: false,
            error: null
        };
    },
    setEmailSent: function () {
        this.setState({
            emailSent: true
        });
    },
    setError: function (error) {
        this.setState({
            error: error
        });
    },
    passwordReset: function () {
        var credentials = {
            email: this.refs.email.getValue()
        };
        this.setError(null);
        this.props.asteroid.call("forgotPassword", credentials)
            .then(this.setEmailSent)
            .catch(this.setError);
    },
    renderError: function () {
        return this.state.error ? (
            <bootstrap.Alert
                bsStyle="danger"
                style={styles.errorAlert}
            >
                {"Alla mail non corrisponde alcun untente"}
            </bootstrap.Alert>
        ) : null;
    },
    renderInfoMessage: function () {
        return (
            <h4 className="text-center">
                {"Riceverai un link alla pagina di reset all'indirizzo e-mail indicato"}
            </h4>
        );
    },
    renderResetForm: function () {
        return (
            <div>
                <div className="ac-login-modal-inputs" style={styles.inputs}>
                    <Radium.Style
                        rules={{
                            ".form-group": {
                                marginBottom: "0px"
                            },
                            ".form-group div, .form-group span, .form-group input": {
                                border: "0px",
                                borderRadius: "0px !important",
                                boxShadow: "none",
                                background: color(colors.darkBlack).alpha(0.1).rgbString(),
                                color: colors.white
                            },
                            ".form-control:focus": {
                                boxShadow: "none"
                            }
                        }}
                        scopeSelector=".ac-login-modal-inputs"
                    />
                    <bootstrap.Input
                        addonBefore={<components.Icon icon="user" />}
                        bsSize="large"
                        placeholder="Email"
                        ref="email"
                        type="email"
                    />
                </div>
                <components.Spacer direction="v" size={16} />
                <components.Button
                    block={true}
                    bsSize="large"
                    onClick={this.passwordReset}
                    style={styles.button}
                >
                    {"Invia mail di reset"}
                </components.Button>
                {this.renderError()}
            </div>
        );
    },
    render: function () {
        return (
            this.state.emailSent ?
            this.renderInfoMessage() :
            this.renderResetForm()
        );
    }
});

module.exports = Radium(PasswordResetView);
